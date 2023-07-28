const request = require('supertest');
const mongoose = require("mongoose");
const app = require('../app');
const User = require('../models/User');
const { users } = require('./testsData');

require("dotenv").config();

let user1Id, user2Id;

// setup and teardown
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
    console.log('Successfully connected to the database.');

  } catch (err) {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit(1); // Exit with an error code to indicate failure
  }
});

// beforeEach(async () => {
//   await Wallet.deleteMany({});
// });

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

// // helper functions
// const createWallet = async (wallet) => {
//   const res =  await request(app).post('/wallets').send(wallet);
//   return res;
// }

// tests
describe('Budget routes', () => {
  test ('should return empty array if no budgets', async () => {
    const { body, statusCode }  = await request(app).get('/budgets');

    expect(statusCode).toEqual(200);
    expect(body).toEqual([]);
  });
});
