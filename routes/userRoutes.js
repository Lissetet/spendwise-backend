const express = require('express');
const router = express.Router()
const { 
  getAll, 
  getItem, 
  getOne, 
  createItem, 
  updateItem, 
  deleteItem, 
  getByQuery,
  getAllChildren,
  validateEmail
} = require('./routeHelpers');

const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// GET user/s by query parameters
const allowedQueryParams = ['email', 'firstName', 'lastName'];
router.get('/find', getByQuery(User, allowedQueryParams));

// GET one user
router.get('/:id', getItem(User), getOne(User));

// GET all users
router.get('/', getAll(User));

// CREATE one user
router.post('/', validateEmail(), createItem(User));

// UPDATE one user
const allowedUpdates = ['firstName', 'lastName', 'email', 'password'];
router.patch('/:id', getItem(User), updateItem(User, allowedUpdates)); 

// DELETE a user
router.delete('/:id', getItem(User), deleteItem(User));

// GET all wallets for a user
router.get('/:id/wallets', getAllChildren(Wallet));

// GET all budgets for a user
router.get('/:id/budgets', getAllChildren(Budget));

// GET all transactions for a user
router.get('/:id/transactions', getAllChildren(Transaction));

// GET all categories for a user
router.get('/:id/categories', getAllChildren(Category));

module.exports = router;