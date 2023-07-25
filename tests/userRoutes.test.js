const request = require('supertest');
const mongoose = require("mongoose");
const app = require('../app');
const User = require('../models/User');
const { user1, user2 } = require('./testsData');

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

// tests
describe('User routes', () => {
  test('should create a new user', async () => {
    const { body, statusCode } = await request(app).post('/users').send(user1);

    expect(statusCode).toEqual(201);
    expect(body).toMatchObject(user1);
  });

  test('missing required fields should return 400', async () => {
    const user = {email: 'testemail@email.com'};

    const res = await request(app).post('/users').send(user);
    const msg = res.body.message;

    let expectedErrorParts = [
      'firstName: Path `firstName` is required',
      'lastName: Path `lastName` is required',
      'password: Path `password` is required'
    ];

    expect(expectedErrorParts.every(part => msg.includes(part))).toBeTruthy();
    expect(res.statusCode).toEqual(400);
  });

  test('empty required fields should return 400', async () => {
    const user = {
      firstName: '',
      lastName: '',
      email: 'testemail@email.com',
      password: '',
    };

    const res = await request(app).post('/users').send(user);
    const msg = res.body.message;

    let expectedErrorParts = [
      'firstName: Path `firstName` is required',
      'lastName: Path `lastName` is required',
      'password: Path `password` is required'
    ];

    expect(expectedErrorParts.every(part => msg.includes(part))).toBeTruthy();
    expect(res.statusCode).toEqual(400);
  });

  test('should get all users', async () => {

    await request(app).post('/users').send(user1);
    await request(app).post('/users').send(user2);
  
    const res = await request(app).get('/users');
  
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body).toContainEqual(expect.objectContaining(user1));
    expect(res.body).toContainEqual(expect.objectContaining(user2));
  });

  test('should get a single user', async () => {
    const { body: { _id } } = await request(app).post('/users').send(user1);

    const res = await request(app).get(`/users/${_id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject(user1);
  });

  test('should update a user', async () => {
    const { body: { _id } } = await request(app).post('/users').send(user1);

    const updatedUser = {
      firstName: 'Updated',
      lastName: 'User',
    };

    const res = await request(app).patch(`/users/${_id}`).send(updatedUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({...user1, ...updatedUser});
  });

  test('should delete a user', async () => {
    const { body: { _id } } = await request(app).post('/users').send(user1);

    const res = await request(app).delete(`/users/${_id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Deleted user'});
  });

  test('should return 404 if user not found', async () => {
    const res = await request(app).get('/users/5f9c7e7a7f8a3b2b7c5b8a1d');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Cannot find user'});
  });

  test('should return 400 if id is invalid', async () => {
    const res = await request(app).get('/users/123');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid user ID'});
  });

  test('should return 400 if email already exists', async () => {
    await request(app).post('/users').send(user1);
    const res = await request(app).post('/users').send(user1);
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'email already exists' });
  });

  test('should return 400 if email is invalid', async () => {
    const user = {...user1, email: 'invalidEmail'};
    const res = await request(app).post('/users').send(user);
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid email' });
  });

  test('should return 400 if email is empty', async () => {
    const user = {...user1, email: ''};
    const res = await request(app).post('/users').send(user);
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid email' });
  });

  test('should return 400 if invalid update passed in', async () => {
    const { body: { _id } } = await request(app).post('/users').send(user1);

    const res = await request(app).patch(`/users/${_id}`).send({invalid: 'invalid'});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid updates', invalidUpdates: ['invalid'] });
  });

  test('should return 400 if null update passed in', async () => {
    const { body: { _id } } = await request(app).post('/users').send(user1);

    const res = await request(app).patch(`/users/${_id}`).send({firstName: null});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid updates', invalidUpdates: ['firstName'] });
  });
  
});
