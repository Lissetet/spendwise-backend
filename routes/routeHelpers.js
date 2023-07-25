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

module.exports = {
  getAll, getItem, validateEmail, createItem, getOne, updateItem, deleteItem
}