const express = require('express');
const router = express.Router()
const { 
  getAll, 
  getItem, 
  getOne, 
  createItem, 
  updateItem, 
  deleteItem,
  getByQuery
} = require('./routeHelpers');

const Transaction = require('../models/Transaction');

// GET all Transactions
router.get('/', getAll(Transaction));

// GET Transaction/s by query parameters
router.get('/find', getByQuery(Transaction, ['user']));

// GET one Transaction
router.get('/:id', getItem(Transaction), getOne(Transaction));

// CREATE one Transaction
router.post('/', createItem(Transaction));

// UPDATE one Transaction
const allowedUpdates = ['amount', 'description', 'date', 'type', 'account', 'category'];
router.patch('/:id', getItem(Transaction), updateItem(Transaction, allowedUpdates)); 

// DELETE a Transaction
router.delete('/:id', getItem(Transaction), deleteItem(Transaction));

module.exports = router;