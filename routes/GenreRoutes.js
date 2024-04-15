const express = require('express');
const router = express.Router();
const { createGenre } = require('../controllers/GenreController');

router.post('/create', createGenre);

module.exports = router;