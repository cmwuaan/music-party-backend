const express = require('express');
const router = express.Router();
const { postRoom
    , postNewMusicToRoomPlaylist,
removeMusicToRoomPlaylist} = require('../controllers/RoomController');

router.post('/create', postRoom);

router.post('/addMusic', postNewMusicToRoomPlaylist)

router.put('/removeMusic', removeMusicToRoomPlaylist)
module.exports = router;