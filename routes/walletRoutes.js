const express = require('express');
const router = express.Router()

const Wallet = require('../models/Wallet');

// Example route: GET /
router.get('/', (req, res) => {
  res.json("success");
});

module.exports = router;
