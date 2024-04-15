const express = require('express');
const router = express.Router();
const { createGenre, getFamousGenre, changeGenreStatus, findGenre } = require('../../controllers/controllerClient/GenreController');

router.post('/create', createGenre);

router.get('/famous', getFamousGenre);

router.put('/changeStatus', changeGenreStatus);

module.exports = router;