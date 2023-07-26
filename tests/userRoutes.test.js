const request = require('supertest');
const mongoose = require("mongoose");
const app = require('../app');
const User = require('../models/User');
const { user1, user2, wallet1, wallet2 } = require('./testsData');

require("dotenv").config();

// setup and teardown
beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URL)
    .then(() => {
      console.log('Successfully connected to the database.');
    }
  ).catch((err) => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

// helper functions
const createUser = async (user) => {
  const res =  await request(app).post('/users').send(user);
  return res;
}

// tests
describe('User routes', () => {
  test ('should return empty array if no users', async () => {
    const { body, statusCode }  = await request(app).get('/users');

    expect(statusCode).toEqual(200);
    expect(body).toEqual([]);
  });

  test('should create a new user', async () => {
    const { body, statusCode } = await createUser(user1);

    expect(statusCode).toEqual(201);
    expect(body).toMatchObject(user1);
  });

  test('missing required fields should return 400', async () => {
    const user = {email: 'testemail@email.com'};
    const { body, statusCode } = await createUser(user);

    let expectedErrorParts = [
      'firstName: Path `firstName` is required',
      'lastName: Path `lastName` is required',
      'password: Path `password` is required'
    ];

    expect(statusCode).toEqual(400);
    expectedErrorParts.forEach((part) => expect(body.message).toContain(part));
  });

  test('empty required fields should return 400', async () => {
    const user = {
      firstName: '',
      lastName: '',
      email: 'testemail@email.com',
      password: '',
    };

    const { body, statusCode } = await createUser(user);

    let expectedErrorParts = [
      'firstName: Path `firstName` is required',
      'lastName: Path `lastName` is required',
      'password: Path `password` is required'
    ];

    expect(statusCode).toEqual(400);
    expectedErrorParts.forEach((part) => expect(body.message).toContain(part));
  });

  test('should get all users', async () => {

    await createUser(user1);
    await createUser(user2);
  
    const { body, statusCode } = await request(app).get('/users');
  
    expect(statusCode).toEqual(200);
    expect(body.length).toEqual(2);
    expect(body).toContainEqual(expect.objectContaining(user1));
    expect(body).toContainEqual(expect.objectContaining(user2));
  });

  test('should get a single user', async () => {
    const { body: { _id } } = await createUser(user1);
    const { body, statusCode } = await request(app).get(`/users/${_id}`);

    expect(statusCode).toEqual(200);
    expect(body).toMatchObject(user1);
  });

  test('should update a user', async () => {
    const { body: { _id } } = await createUser(user1);
    const updatedUser = {
      firstName: 'Updated',
      lastName: 'User',
    };
    const { body, statusCode } = 
      await request(app).patch(`/users/${_id}`).send(updatedUser);

    expect(statusCode).toEqual(200);
    expect(body).toMatchObject({...user1, ...updatedUser});
  });

  test('should delete a user', async () => {
    const { body: { _id } } = await createUser(user1);
    const { body, statusCode } = await request(app).delete(`/users/${_id}`);

    expect(statusCode).toEqual(200);
    expect(body).toEqual({ message: 'Deleted user'});
  });

  test('should return 404 if user not found', async () => {
    const { body, statusCode } = 
      await request(app).get('/users/5f9c7e7a7f8a3b2b7c5b8a1d');

    expect(statusCode).toEqual(404);
    expect(body).toEqual({ message: 'Cannot find user'});
  });

  test('should return 400 if id is invalid', async () => {
    const { body, statusCode } = await request(app).get('/users/123');

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid user ID'});
  });

  test('should return 400 if email already exists', async () => {
    await createUser(user1);
    const { body, statusCode } = await request(app).post('/users').send(user1);
    
    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'email already exists' });
  });

  test('should return 400 if email is invalid', async () => {
    const user = {...user1, email: 'invalidEmail'};
    const { body, statusCode } = await createUser(user);
    
    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid email' });
  });

  test('should return 400 if email is empty', async () => {
    const user = {...user1, email: ''};
    const { body, statusCode } = await createUser(user);
    
    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid email' });
  });

  test('should return 400 if invalid update passed in', async () => {
    const { body: { _id } } = await createUser(user1);
    const { body, statusCode } = 
      await request(app).patch(`/users/${_id}`).send({invalid: 'invalid'});

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid updates', invalidUpdates: ['invalid'] });
  });

  test('should return 400 if null update passed in', async () => {
    const { body: { _id } } = await createUser(user1);
    const { body, statusCode } = 
      await request(app).patch(`/users/${_id}`).send({firstName: null});

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid updates', invalidUpdates: ['firstName'] });
  });

  test('should return unique user when queried by email', async () => {
    await createUser(user1);
    const { body, statusCode } =
      await request(app).get(`/users/find?email=${user1.email}&unique`);

    expect(statusCode).toEqual(200);
    expect(body).toMatchObject(user1);
  });

  test('should return 400 if query param is not allowed', async () => {
    const { body, statusCode } =
      await request(app).get(`/users/find?invalid=invalid`);

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ 
      message: 'Invalid query. It should have at least one field.', 
      allowedQueryParams: ['email', 'firstName', 'lastName'] 
    });
  });

  test('should return all users with matching firstName', async () => {
    const duplicateNameUser = {...user1, email: 'newemail@email.com'}
    await createUser(user1);
    await createUser(duplicateNameUser);
    const { body, statusCode } =
      await request(app).get(`/users/find?firstName=${user1.firstName}`);

    expect(statusCode).toEqual(200);
    expect(body.length).toEqual(2);
    expect(body).toContainEqual(expect.objectContaining(user1));
    expect(body).toContainEqual(expect.objectContaining(duplicateNameUser));
  });

  test('should return 400 if duplicate values exist and unique is req', async () => {
    const duplicateNameUser = {...user1, email: 'newemail@email.com'}
    await createUser(user1);
    await createUser(duplicateNameUser);

    const { body, statusCode } =
      await request(app).get(`/users/find?firstName=${user1.firstName}&unique`);

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Duplicate values exist' });
  });

});
