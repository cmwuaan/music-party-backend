const express = require('express');
const router = express.Router();

const {
  getMusicUnauthentication,
  searchUnauthenticatedMusic,
  getAllMusic,
  searchAllMusic,
  updateMusicInformationAdmin,
  deleteMusicByID,
  getMusicByID,
  approveSong,
  approveList,
  deleteList,
} = require('../../controller/controllerAdmin/musicAdminController');

const { authenticateToken } = require('../../authentication/jwtAuth');

// GET: Get all music unauthentication
router
  .route('/music-unauthentication')
  .get(authenticateToken, getMusicUnauthentication)
  .put(authenticateToken, approveList);

// GET: Search music unauthentication
router
  .route('/music-unauthentication/search')
  .get(authenticateToken, searchUnauthenticatedMusic);
router.route('/music-unauthentication/:id').put(authenticateToken, approveSong);

// GET: Get all music
router.route('/').get(authenticateToken, getAllMusic);

// GET: Search music
router.route('/search').get(authenticateToken, searchAllMusic);

// PUT: Update music information
// GET: Get music by ID
router
  .route('/:id')
  .put(authenticateToken, updateMusicInformationAdmin)
  .get(authenticateToken, getMusicByID)
  .delete(authenticateToken, deleteMusicByID);

module.exports = router;
