const express = require('express');
const router = express.Router()
// const { 
//   getAll, 
//   getItem, 
//   getOne, 
//   createItem, 
//   updateItem, 
//   deleteItem, 
//   getByQuery,
//   getAllChildren,
//   validateEmail
// } = require('./routeHelpers');

// const User = require('../models/User');
// const Account = require('../models/Account');
// const Budget = require('../models/Budget');
// const Transaction = require('../models/Transaction');
// const Category = require('../models/Category');

// // GET user/s by query parameters
// const allowedQueryParams = ['email', 'firstName', 'lastName'];
// router.get('/find', getByQuery(User, allowedQueryParams));

// // GET one user
// router.get('/:id', getItem(User), getOne(User));

// // GET all Accounts for a user
// router.get('/:id/accounts', getAllChildren(Account));

// // GET all budgets for a user
// router.get('/:id/budgets', getAllChildren(Budget));

// // GET all transactions for a user
// router.get('/:id/transactions', getAllChildren(Transaction));

// // GET all categories for a user
// router.get('/:id/categories', getAllChildren(Category));

module.exports = router;