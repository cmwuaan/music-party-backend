const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./database/config");
const multer = require('multer');
dotenv.config();

const app = express();

connectDB();

// app.use("/api/music", require("./route/MusicRoute"));
app.use(bodyParser.json());
app.use(logger("dev"));
// app.use("/api/music", require("./route/MusicRoute"));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



