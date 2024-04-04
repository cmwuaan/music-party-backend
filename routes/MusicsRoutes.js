const express = require('express');
const router = express.Router();

const { uploadMusic, getMusicList } = require('../controllers/MusicController');

router.get('/', getMusicList);
router.post('/upload', uploadMusic);

module.exports = router;
