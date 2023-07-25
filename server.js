// imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// initialize mongoose
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to MongoDB"));

// initialize express
const app = express();
app.use(cors());
app.use(express.json());

// start server
app.listen(3000, () => console.log("Server started on port 3000"));
