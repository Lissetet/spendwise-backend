const express = require('express');
const router = express.Router()
const { 
  getAll, 
  getItem, 
  getOne, 
  createItem, 
  updateItem, 
  deleteItem
} = require('./routeHelpers');

const Wallet = require('../models/Wallet');

// GET all Wallets
router.get('/', getAll(Wallet));

// GET one Wallet
router.get('/:id', getItem(Wallet), getOne(Wallet));

// CREATE one Wallet
router.post('/', createItem(Wallet));

// UPDATE one Wallet
const allowedUpdates = ['name', 'balance', 'type'];
router.patch('/:id', getItem(Wallet), updateItem(Wallet, allowedUpdates)); 

// DELETE a Wallet
router.delete('/:id', getItem(Wallet), deleteItem(Wallet));

module.exports = router;