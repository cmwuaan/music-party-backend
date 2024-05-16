const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../../authentication/jwtAuth');

const {
  getAllPlaylist,
  searchPlaylist,
  getPlaylistByID,
  updatePlaylistByID,
  deletePlaylistById,
  removeSongFromPlaylist,
} = require('../../controller/controllerAdmin/playlistAdminController');

// GET: Get all playlist
router.route('/').get(authenticateToken, getAllPlaylist);

// GET: Search playlist
router.route('/search').get(authenticateToken, searchPlaylist);

router
  .route('/remove-music/:id')
  .put(authenticateToken, removeSongFromPlaylist);

router
  .route('/:id')
  .get(authenticateToken, getPlaylistByID)
  .put(authenticateToken, updatePlaylistByID)
  .delete(authenticateToken, deletePlaylistById);

module.exports = router;
