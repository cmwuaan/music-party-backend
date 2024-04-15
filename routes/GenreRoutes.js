const express = require('express');
const router = express.Router();
const { createGenre, getFamousGenre, changeGenreStatus, findGenre } = require('../controllers/GenreController');

router.post('/create', createGenre);

router.get('/famous', getFamousGenre);

module.exports = router;