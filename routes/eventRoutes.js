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

const Event = require('../models/Event');

// GET all Events
router.get('/', getAll(Event));

// GET one Event
router.get('/:id', getItem(Event), getOne(Event));

// CREATE one Event
router.post('/', createItem(Event));

// UPDATE one Event
const allowedUpdates = ['year', 'month', 'day', 'tag', 'type'];
router.patch('/:id', getItem(Event), updateItem(Event, allowedUpdates)); 

// DELETE a Event
router.delete('/:id', getItem(Event), deleteItem(Event));

module.exports = router;