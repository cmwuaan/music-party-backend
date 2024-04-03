const express = require("express");
const router = express.Router();
const { uploadMusic } = require("../controller/MusicController");

router.route("/upload").post(uploadMusic);

module.exports = router;