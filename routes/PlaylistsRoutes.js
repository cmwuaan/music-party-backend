const express = require('express');
const router = express.Router();
const { CreatePlaylist, addNewSongToPlaylist, removeSongFromPlaylist, deletePlaylistByID } = require('../controllers/PlaylistController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


router.post('/create', upload.fields([{name: 'avatarPlaylist'}]) ,CreatePlaylist);

router.put('/addSong', addNewSongToPlaylist);

router.delete('/removeSong', removeSongFromPlaylist);

router.delete('/deletePlaylist', deletePlaylistByID)
module.exports = router;    