const { query } = require('express');
const mongoose = require('mongoose');
const validator = require('validator');

const validateEmail = () => async (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  next();
}

const getAll = (Model) => async (req, res) => {
  try {
    const items = await Model.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getItem = (Model) => async (req, res, next) => {
  let item;
  const modelName = Model.modelName.toLowerCase();

  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: `Invalid ${modelName} ID` });
  }

  try {
    item = await Model.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: `Cannot find ${modelName}`});
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.item = item;
  next();
}

const getOne = (Model) => async (req, res) => {
  res.json(res.item);
}

const createItem = (Model) => async (req, res) => {
  const item = new Model(req.body);

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    if (err.code === 11000) {
      const duplicateKey = Object.keys(err.keyValue)[0];
      return res.status(400).json({ message: `${duplicateKey} already exists` });
    }
    res.status(400).json({ message: err.message });
  }
}

const updateItem = (Model, allowedUpdates) => async (req, res) => {
  const updates = Object.keys(req.body);
  const isValid = (update) => allowedUpdates.includes(update) && req.body[update] != null;
  const isValidOperation = updates.every(isValid);

  if (!isValidOperation) {
    const invalidUpdates = updates.filter(update => !isValid(update));
    const message = 'Invalid updates'
    return res.status(400).json({ message, invalidUpdates });
  } else {
    updates.forEach(update => res.item[update] = req.body[update]);
  }

  try {
    const updatedItem = await res.item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const deleteItem = (Model) => async (req, res) => {
  const modelName = Model.modelName.toLowerCase();

  try {
    const item = await Model.findByIdAndDelete(req.params.id);

    if (item == null) {
      return res.status(404).json({ message: `Cannot find ${modelName}` });
    }

    res.json({ message: `Deleted ${modelName}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getByQuery = (Model, allowedQueryParams) => async (req, res) => {
  const unique = req.query.unique !== undefined;
  delete req.query.unique;
  const queryKeys = Object.keys(req.query);
  const validQuery = queryKeys.every(key => allowedQueryParams.includes(key));

  if (!validQuery) {
    const errorMsg = `Invalid query. It should have at least one field.`;
    const errorObj = { message: errorMsg, allowedQueryParams };
    return res.status(400).json({ ...errorObj });
  }

  try {
    const items = await Model.find(req.query);
    if (unique && items.length > 1) {
      return res.status(400).json({ message: `Duplicate values exist` });
    } else if (unique && items.length === 1) {
      return res.status(200).json(items[0]);
    } else {
      return res.status(200).json(items);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
}

const getAllChildren = (Model) => async (req, res) => {
  const { id } = req.params;
  const items = await Model.find({ user: id });
  res.json(items);
}

module.exports = {
  getAll, 
  getItem, 
  validateEmail, 
  createItem, 
  getOne, 
  updateItem, 
  deleteItem, 
  getByQuery,
  getAllChildren
}