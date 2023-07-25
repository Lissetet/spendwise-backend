const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5050;
const ENV = process.env.NODE_ENV;

require("dotenv").config();

let dbURL = ENV ? process.env.DEV_DATABASE_URL  : process.env.DATABASE_URL;

mongoose
  .connect(dbURL)
  .then(() => {
    ENV !== "test" && app.listen(PORT, console.log("Server running on port 5050"));
  })
  .catch((err) => {
    console.log(err);
  });