const express = require('express');
const router = express.Router()

const Category = require('../models/Category');

// Example route: GET /
router.get('/', (req, res) => {
  res.json("success");
});

module.exports = router;
