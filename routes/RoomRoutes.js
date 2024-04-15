const express = require('express');
const router = express.Router();
const { postRoom } = require('../controllers/RoomController');

router.post('/create', postRoom);
module.exports = router;