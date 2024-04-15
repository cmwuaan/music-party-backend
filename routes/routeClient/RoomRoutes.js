const express = require('express');
const router = express.Router();
const { postRoom
    , postNewMusicToRoomPlaylist, getCurrentRoomMusic,
removeMusicToRoomPlaylist} = require('../../controllers/controllerClient/RoomController');

router.post('/create', postRoom);

router.post('/addMusic', postNewMusicToRoomPlaylist)

router.put('/removeMusic', removeMusicToRoomPlaylist)

router.get('/currentRoomMusic', getCurrentRoomMusic)
module.exports = router;