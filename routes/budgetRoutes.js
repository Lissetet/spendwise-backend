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

const Budget = require('../models/Budget');

// GET all Budgets
router.get('/', getAll(Budget));

// GET Budget/s by query parameters
router.get('/find', getByQuery(Budget, ['user']));

// GET one Budget
router.get('/:id', getItem(Budget), getOne(Budget));

// CREATE one Budget
router.post('/', createItem(Budget));

// UPDATE one Budget
const allowedUpdates = ['name', 'amount', 'start_date', 'end_date', 'category'];
router.patch('/:id', getItem(Budget), updateItem(Budget, allowedUpdates)); 

// DELETE a Budget
router.delete('/:id', getItem(Budget), deleteItem(Budget));

module.exports = router;