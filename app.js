const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json()).use(cors());

app.get("/", (req, res) => {
  res.status(200).json("Server is running.");
});

// initialize routes
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const accountRoutes = require('./routes/accountRoutes');
const eventRoutes = require('./routes/eventRoutes');
app.use('/users', userRoutes);
app.use('/budgets', budgetRoutes);
app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);
app.use('/accounts', accountRoutes);
app.use('/events', eventRoutes);

module.exports = app;