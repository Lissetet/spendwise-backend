const express = require('express');
const router = express.Router()
const { 
  getAll, 
  getItem, 
  getOne, 
  createItem, 
  updateItem, 
  deleteItem,
} = require('./routeHelpers');

const Account = require('../models/Account');

// GET all Accounts
router.get('/', getAll(Account));

// GET one Account
router.get('/:id', getItem(Account), getOne(Account));

// CREATE one Account
router.post('/', createItem(Account));

// UPDATE one Account
const allowedUpdates = ['name', 'type'];
router.patch('/:id', getItem(Account), updateItem(Account, allowedUpdates)); 

// DELETE a Account
router.delete('/:id', getItem(Account), deleteItem(Account));

module.exports = router;