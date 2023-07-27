const request = require('supertest');
const mongoose = require("mongoose");
const app = require('../app');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { user1, user2, wallet1, wallet2 } = require('./testsData');

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
    wallet1.user = user1Id;
    user2Id = newUser2._id;
    wallet2.user = user2Id;
  } catch (err) {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit(1); // Exit with an error code to indicate failure
  }
});

beforeEach(async () => {
  await Wallet.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await Wallet.deleteMany({});
  await mongoose.connection.close();
});

// helper functions
const createWallet = async (wallet) => {
  const res =  await request(app).post('/wallets').send(wallet);
  return res;
}

// tests
describe('Wallet routes', () => {
  test ('should return empty array if no wallets', async () => {
    const { body, statusCode }  = await request(app).get('/wallets');

    expect(statusCode).toEqual(200);
    expect(body).toEqual([]);
  });

  test('should create a new wallet', async () => {
    const { body, statusCode } = await createWallet(wallet1);

    expect(statusCode).toEqual(201);
    expect(body).toMatchObject({...wallet1, user: user1Id.toString()});
  });

  test('missing required fields should return 400', async () => {
    const wallet = {};
    const { body, statusCode } = await createWallet(wallet);

    let expectedErrorParts = [
      'balance: Path `balance` is required',
      'name: Path `name` is required',
      'user: Path `user` is required'
    ];

    expect(statusCode).toEqual(400);
    expectedErrorParts.forEach((part) => expect(body.message).toContain(part));
  });

  test('missing type should default to "other"', async () => {
    const { body, statusCode } = await createWallet({...wallet2, type: undefined});

    expect(statusCode).toEqual(201);
    expect(body).toMatchObject({...wallet2, user: user2Id.toString(), type: 'other'});
  });

  test('empty required fields should return 400', async () => {
    const wallet = { name: '', balance: '' };
    const { body, statusCode } = await createWallet(wallet);

    let expectedErrorParts = [
      'balance: Path `balance` is required',
      'name: Path `name` is required',
      'user: Path `user` is required'
    ];

    expect(statusCode).toEqual(400);
    expectedErrorParts.forEach((part) => expect(body.message).toContain(part));
  });

  test('should return all wallets', async () => {
    await createWallet(wallet1);
    await createWallet(wallet2);

    const res = await request(app).get('/wallets');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0]).toMatchObject({...wallet1, user: user1Id.toString()});
    expect(res.body[1]).toMatchObject({...wallet2, user: user2Id.toString()});
  });

  test('should return a single wallet', async () => {
    const { body: { _id } } = await createWallet(wallet1);

    const res = await request(app).get(`/wallets/${_id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({...wallet1, user: user1Id.toString()});
  });

  test('should update a wallet', async () => {
    const { body: { _id } } = await createWallet(wallet1);
    const res = 
      await request(app).patch(`/wallets/${_id}`).send({ name: 'New Name' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({...wallet1, user: user1Id.toString(), name: 'New Name'});
  });

  test('should delete a wallet', async () => {
    const { body: { _id } } = await createWallet(wallet1);
    const res = await request(app).delete(`/wallets/${_id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Deleted wallet'});
  });


  test('should return 404 if wallet not found', async () => {
    const res = await request(app).get(`/wallets/123456789012`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Cannot find wallet'});
  });

  test('should return 400 if wallet id is invalid', async () => {
    const res = await request(app).get(`/wallets/123`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Invalid wallet ID'});
  });

  test('should return 400 if invalid update passed in', async () => {
    const { body: { _id } } = await createWallet(wallet1);
    const { body, statusCode } = 
      await request(app).patch(`/wallets/${_id}`).send({ invalid: 'invalid' });

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid updates', invalidUpdates: ['invalid'] });
  });

  test('should return 400 if null update passed in', async () => {
    const { body: { _id } } = await createWallet(wallet1);
    const { body, statusCode } = 
      await request(app).patch(`/wallets/${_id}`).send({ name: null });

    expect(statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Invalid updates', invalidUpdates: ['name'] });
  });

  test('should return all wallets for a user when queried', async () => {
    await createWallet(wallet1);
    await createWallet(wallet2);

    const res = await request(app).get(`/wallets/find?user=${user1Id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toMatchObject({...wallet1, user: user1Id.toString()});

    const res2 = await request(app).get(`/wallets/find?user=${user2Id}`);
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.length).toEqual(1);
    expect(res2.body[0]).toMatchObject({...wallet2, user: user2Id.toString()});
  });
 
});
