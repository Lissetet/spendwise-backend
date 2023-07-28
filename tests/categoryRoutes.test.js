const request = require('supertest');
const mongoose = require("mongoose");
const app = require('../app');
const User = require('../models/User');
const Category = require('../models/Category');
const { users, categories } = require('./testsData');

const [user1, user2] = users;
const [category1, category2] = categories;

require("dotenv").config();

let user1Id, user2Id;

// setup and teardown
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
    console.log('Successfully connected to the database.');

    // Create users to test with and save them to the database
    const newUser1 = await new User(user1).save();
    const newUser2 = await new User(user2).save();
    
    user1Id = newUser1._id;
    user2Id = newUser2._id;
    
    category1.user = user1Id;
    category2.user = user2Id;
  } catch (err) {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit(1); // Exit with an error code to indicate failure
  }
});

beforeEach(async () => {
  await Category.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await mongoose.connection.close();
});

// helper functions
const createCategory = async (Category) => {
  const res =  await request(app).post('/categories').send(Category);
  return res;
}

// tests
describe('Category routes', () => {
  test ('should return empty array if no categories', async () => {
    const { body, statusCode }  = await request(app).get('/categories');

    expect(statusCode).toEqual(200);
    expect(body).toEqual([]);
  });

  test('should create a new Category', async () => {
    const { body, statusCode } = await createCategory(category1);

    expect(statusCode).toEqual(201);
    expect(body).toMatchObject({...category1, user: user1Id.toString()});
  });

  test('missing required fields should return 400', async () => {
    const Category = {};
    const { body, statusCode } = await createCategory(Category);

    let expectedErrorParts = [
      'name: Path `name` is required',
      'user: Path `user` is required',
    ];

    expect(statusCode).toEqual(400);
    expectedErrorParts.forEach((part) => expect(body.message).toContain(part));
  });

  test('empty required fields should return 400', async () => {
    const Category = { name: '', balance: '' };
    const { body, statusCode } = await createCategory(Category);

    let expectedErrorParts = [
      'name: Path `name` is required',
      'user: Path `user` is required',
    ];

    expect(statusCode).toEqual(400);
    expectedErrorParts.forEach((part) => expect(body.message).toContain(part));
  });

  test('should return all categories', async () => {
    await createCategory(category1);
    await createCategory(category2);

    const res = await request(app).get('/categories');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0]).toMatchObject({...category1, user: user1Id.toString()});
    expect(res.body[1]).toMatchObject({...category2, user: user2Id.toString()});
  });

  test('should return a single Category', async () => {
    const { body: { _id } } = await createCategory(category1);

    const res = await request(app).get(`/categories/${_id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({...category1, user: user1Id.toString()});
  });

  test('should update a Category', async () => {
    const { body: { _id } } = await createCategory(category1);
    const res = 
      await request(app).patch(`/categories/${_id}`).send({ name: 'New Name' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({...category1, user: user1Id.toString(), name: 'New Name'});
  });

  test('should delete a Category', async () => {
    const { body: { _id } } = await createCategory(category1);
    const res = await request(app).delete(`/categories/${_id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Deleted category'});
  });


  test('should return 404 if Category not found', async () => {
    const res = await request(app).get(`/categories/123456789012`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Cannot find category'});
  });

  test('should return 400 if Category id is invalid', async () => {
    const res = await request(app).get(`/categories/123`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid category ID'});
  });

  test('should return 400 if invalid update passed in', async () => {
    const { body: { _id } } = await createCategory(category1);
    const { body, statusCode } = 
      await request(app).patch(`/categories/${_id}`).send({ invalid: 'invalid' });

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid updates', invalidUpdates: ['invalid'] });
  });

  test('should return 400 if null update passed in', async () => {
    const { body: { _id } } = await createCategory(category1);
    const { body, statusCode } = 
      await request(app).patch(`/categories/${_id}`).send({ name: null });

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid updates', invalidUpdates: ['name'] });
  });

  test('should return all categories for a user when queried', async () => {
    await createCategory(category1);
    await createCategory(category2);

    const res = await request(app).get(`/categories/find?user=${user1Id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toMatchObject({...category1, user: user1Id.toString()});

    const res2 = await request(app).get(`/categories/find?user=${user2Id}`);
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.length).toEqual(1);
    expect(res2.body[0]).toMatchObject({...category2, user: user2Id.toString()});
  });
 
});
