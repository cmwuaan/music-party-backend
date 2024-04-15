const express = require('express');
const router = express.Router();
const { postRoom
, postNewMusicToRoomPlaylist} = require('../controllers/RoomController');

router.post('/create', postRoom);

router.post('/addMusic', postNewMusicToRoomPlaylist)
module.exports = router;