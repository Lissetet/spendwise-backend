const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()
const { 
  getAll, 
  getItem, 
  getOne, 
  createItem, 
  updateItem, 
  deleteItem, 
  validateEmail
} = require('./routeHelpers');

const User = require('../models/User');

// GET all users
router.get('/', getAll(User));

// GET one user
router.get('/:id', getItem(User), getOne(User));

// CREATE one user
router.post('/', validateEmail(), createItem(User));

// UPDATE one user
const allowedUpdates = ['firstName', 'lastName', 'email', 'password'];
router.patch('/:id', getItem(User), updateItem(User, allowedUpdates)); 

// DELETE a user
router.delete('/:id', getItem(User), deleteItem(User));

module.exports = router;