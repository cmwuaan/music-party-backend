const express = require('express');
const router = express.Router();

const { uploadMusic, getMusics } = require('../controllers/MusicController');

router.get('/', getMusics);
router.post('/upload', uploadMusic);

module.exports = router;
