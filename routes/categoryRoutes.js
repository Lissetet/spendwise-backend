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

const Category = require('../models/Category');

// GET all Categories
router.get('/', getAll(Category));

// GET Category/ies by query parameters
const allowedQueryParams = ['user'];
router.get('/find', getByQuery(Category, allowedQueryParams));

// GET one Category
router.get('/:id', getItem(Category), getOne(Category));

// CREATE one Category
router.post('/', createItem(Category));

// UPDATE one Category
const allowedUpdates = ['name', 'users'];
router.patch('/:id', getItem(Category), updateItem(Category, allowedUpdates)); 

// DELETE a Category
router.delete('/:id', getItem(Category), deleteItem(Category));

module.exports = router;