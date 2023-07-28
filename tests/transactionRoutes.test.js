const request = require('supertest');
const mongoose = require("mongoose");
const app = require('../app');
const User = require('../models/User');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const { users, categories, transactions } = require('./testsData');

const [user1, user2] = users;
const [category1, category2] = categories;
const [
  transaction1, 
  transaction2,
  transaction3,
  transaction4,
  transaction5,
  transaction6,
  transaction7, 
  transaction8
] = transactions;

require("dotenv").config();

let user1Id, user2Id, category1Id, category2Id;

// setup and teardown
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
    console.log('Successfully connected to the database.');

    async function saveUserAndCategory(user, category) {
      const newUser = await new User(user).save();
      category.user = newUser._id;
      const newCategory = await new Category(category).save();
      return { user: newUser, category: newCategory };
    }
    
    const [result1, result2] = await Promise.all([
      saveUserAndCategory(user1, category1),
      saveUserAndCategory(user2, category2),
    ]);
    
    user1Id = result1.user._id;
    user2Id = result2.user._id;
    category1Id = result1.category._id;
    category2Id = result2.category._id;

    transaction1.user = user1Id;
    transaction2.user = user1Id;
    transaction3.user = user1Id;
    transaction4.user = user1Id;
    transaction5.user = user2Id;
    transaction6.user = user2Id;
    transaction7.user = user2Id;
    transaction8.user = user2Id;
    
    transaction1.category = category1Id;
    transaction2.category = category2Id;
    transaction3.category = category1Id;
    transaction4.category = category2Id;
    transaction5.category = category1Id;
    transaction6.category = category2Id;
    transaction7.category = category1Id;
    transaction8.category = category2Id;
  } catch (err) {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit(1); // Exit with an error code to indicate failure
  }
});

beforeEach(async () => {
  await Transaction.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Transaction.deleteMany({});
  await mongoose.connection.close();
});

// helper functions
const createTransaction = async (Transaction) => {
  const res =  await request(app).post('/transactions').send(Transaction);
  return res;
}

// tests
describe('Transaction routes', () => {
  test ('should return empty array if no transactions', async () => {
    const { body, statusCode }  = await request(app).get('/transactions');

    expect(statusCode).toEqual(200);
    expect(body).toEqual([]);
  });

  test('should create a new Transaction', async () => {
    const { body, statusCode } = await createTransaction(transaction1);

    expect(statusCode).toEqual(201);
    expect(body).toMatchObject(
      {...transaction1, 
        date: transaction1.date.toISOString(),
        user: user1Id.toString(),
        category: category1Id.toString()
      });
  });

  test('missing required fields should return 400', async () => {
    const Transaction = {};
    const { body, statusCode } = await createTransaction(Transaction);

    let expectedErrorParts = [
      'amount: Path `amount` is required',
      'date: Path `date` is required',
      'user: Path `user` is required',
      'type: Path `type` is required',
    ];

    expect(statusCode).toEqual(400);
    expectedErrorParts.forEach((part) => expect(body.message).toContain(part));
  });

  test('empty required fields should return 400', async () => {
    const Transaction = { amount: '', date: '', type: '' };
    const { body, statusCode } = await createTransaction(Transaction);

    let expectedErrorParts = [
      'amount: Path `amount` is required',
      'date: Path `date` is required',
      'user: Path `user` is required',
      'type: Path `type` is required',
    ];
    console.log(body.message)

    expect(statusCode).toEqual(400);
    expectedErrorParts.forEach((part) => expect(body.message).toContain(part));
  });

  test('should return all transactions', async () => {
    await createTransaction(transaction1);
    await createTransaction(transaction2);
    await createTransaction(transaction3);
    await createTransaction(transaction4);

    const res = await request(app).get('/transactions');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(4);
    expect(res.body[0]).toMatchObject({
      ...transaction1, 
      user: user1Id.toString(),
      category: category1Id.toString(),
      date: transaction1.date.toISOString(),
    });
    expect(res.body[1]).toMatchObject({
      ...transaction2, 
      user: user1Id.toString(),
      category: category2Id.toString(),
      date: transaction2.date.toISOString(),
    });
    expect(res.body[2]).toMatchObject({
      ...transaction3,
      user: user1Id.toString(),
      category: category1Id.toString(),
      date: transaction3.date.toISOString(),
    });
    expect(res.body[3]).toMatchObject({
      ...transaction4,
      user: user1Id.toString(),
      category: category2Id.toString(),
      date: transaction4.date.toISOString(),
    });
  });

  test('should return a single transaction', async () => {
    const { body: { _id } } = await createTransaction(transaction1);

    const res = await request(app).get(`/transactions/${_id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      ...transaction1, 
      user: user1Id.toString(),
      category: category1Id.toString(),
      date: transaction1.date.toISOString(),
    });
  });

  test('should update a transaction', async () => {
    const { body: { _id } } = await createTransaction(transaction1);
    const res = 
      await request(app).patch(`/transactions/${_id}`).send({ type: 'adjustment' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      ...transaction1, 
      user: user1Id.toString(), 
      category: category1Id.toString(),
      date: transaction1.date.toISOString(),
      type: 'adjustment'
    });
  });

  test('should delete a Transaction', async () => {
    const { body: { _id } } = await createTransaction(transaction1);
    const res = await request(app).delete(`/transactions/${_id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Deleted transaction'});
  });


  test('should return 404 if Transaction not found', async () => {
    const res = await request(app).get(`/transactions/123456789012`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Cannot find transaction'});
  });

  test('should return 400 if Transaction id is invalid', async () => {
    const res = await request(app).get(`/transactions/123`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid transaction ID'});
  });

  test('should return 400 if invalid update passed in', async () => {
    const { body: { _id } } = await createTransaction(transaction1);
    const { body, statusCode } = 
      await request(app).patch(`/transactions/${_id}`).send({ invalid: 'invalid' });

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid updates', invalidUpdates: ['invalid'] });
  });

  test('should return 400 if null update passed in', async () => {
    const { body: { _id } } = await createTransaction(transaction1);
    const { body, statusCode } = 
      await request(app).patch(`/transactions/${_id}`).send({ name: null });

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid updates', invalidUpdates: ['name'] });
  });

  test('should return all transactions for a user when queried', async () => {
    await createTransaction(transaction1);
    await createTransaction(transaction2);
    await createTransaction(transaction3);
    await createTransaction(transaction4);
    await createTransaction(transaction5);
    await createTransaction(transaction6);
    await createTransaction(transaction7);
    await createTransaction(transaction8);

    const res = await request(app).get(`/transactions/find?user=${user1Id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(4);

    const res2 = await request(app).get(`/transactions/find?user=${user2Id}`);
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.length).toEqual(4);
  });
 
});
