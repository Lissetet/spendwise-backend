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

  // Check if ID is valid
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

  res[modelName] = item;
  next();
}

const getOne = (Model) => async (req, res) => {
  res.json(res[Model.modelName.toLowerCase()]);
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

module.exports = {
  getAll, getItem, validateEmail, createItem, getOne
}