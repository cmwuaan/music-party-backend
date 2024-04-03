const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./database/config");

dotenv.config();

const app = express();

connectDB();


app.use(bodyParser.json());
app.use(logger("dev"));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});