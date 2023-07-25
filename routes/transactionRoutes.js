const express = require('express');
const router = express.Router()

const Transaction = require('../models/Transaction');

// Example route: GET /
router.get('/', (req, res) => {
  res.json("success");
});

module.exports = router;
