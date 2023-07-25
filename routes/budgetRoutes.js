const express = require('express');
const router = express.Router()

const Budget = require('../models/Budget');

// Example route: GET /
router.get('/', (req, res) => {
  res.json("success");
});

module.exports = router;
