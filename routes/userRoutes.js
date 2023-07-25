const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const router = express.Router()
const { getAll, getOne } = require('./routeHelpers');

const User = require('../models/User');

// GET all users
router.get('/', getAll(User));

// GET one user
router.get('/:id', getOne(User));

// CREATE one user
router.post('/', async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });


  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === 11000 && err.keyValue.email === req.body.email) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(400).json({ message: err.message });
  }

});

// UPDATE one user
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.firstName != null) {
    res.user.firstName = req.body.firstName;
  }
  if (req.body.lastName != null) {
    res.user.lastName = req.body.lastName;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    res.json({ message: 'Deleted User' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function for getting user by ID
async function getUser(req, res, next) {
  let user;

  // Check if ID is valid
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;