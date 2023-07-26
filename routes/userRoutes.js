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
  validateEmail
} = require('./routeHelpers');

const User = require('../models/User');

// GET one user by query parameters
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

module.exports = router;