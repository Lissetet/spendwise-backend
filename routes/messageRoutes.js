const express = require('express');
const router = express.Router()
const { 
  getAll, 
  getItem, 
  getOne, 
  createItem, 
  deleteItem,
} = require('./routeHelpers');

const Message = require('../models/Message');

// GET all Messages
router.get('/', getAll(Message));

// GET one Message
router.get('/:id', getItem(Message), getOne(Message));

// CREATE one Message
router.post('/', createItem(Message));

// DELETE a Message
router.delete('/:id', getItem(Message), deleteItem(Message));

module.exports = router;