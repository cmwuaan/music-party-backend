const express = require('express');
const router = express.Router();

const {
  getAllUser,
  searchUser,
  getUserByID,
  updateUserAccount,
  createUserAccount,
  deleteUserById,
  deleteUserListByIdList,
} = require('../../controller/controllerAdmin/userAdminController');
const { authenticateToken } = require('../../authentication/jwtAuth');

// GET: Get all user with limit 50 as default
router
  .route('/')
  .get(authenticateToken, getAllUser)
  .post(authenticateToken, createUserAccount)
  .put(authenticateToken, deleteUserListByIdList);

// GET: Search user with limit 50 as default
router.route('/search').get(authenticateToken, searchUser);

// GET:  Get information of user by ID
// PUT: Update information of user by ID
router
  .route('/:id')
  .get(authenticateToken, getUserByID)
  .put(authenticateToken, updateUserAccount)
  .delete(authenticateToken, deleteUserById);

module.exports = router;
