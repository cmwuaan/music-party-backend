const express = require('express');
const router = express.Router();
const {
  CreatePlaylist,
  getMostPopularPlaylist,
  getPlaylistByID,
  addNewSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylistByID,
} = require('../../controllers/client/PlaylistController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/create', upload.fields([{ name: 'avatarPlaylist' }]), CreatePlaylist);

router.put('/addSong', addNewSongToPlaylist);

router.delete('/removeSong', removeSongFromPlaylist);

router.delete('/deletePlaylist', deletePlaylistByID);

router.get('/getPlaylist/:id', getPlaylistByID);

router.get('/getMostPopularPlaylist', getMostPopularPlaylist);
module.exports = router;
