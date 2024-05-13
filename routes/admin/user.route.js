const express = require('express');
const router = express.Router();
const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  searchUser,
  deleteUserById,
  deleteAllUser,
} = require('../../controllers/admin/user.controller.js');
const { authenticateToken } = require('../../config/jwtAuth.js');

// GET: Get all users with 50 users as default limit
router.route('/').get(getAllUser).post(createUser).put(deleteAllUser);

// // GET: Search user by ID with 50 users as default limit
// router.route('/search').get(authenticateToken, searchUser);

// // GET: Get user by ID
// // PATCH: Update user by ID
// router
//   .route('/:id')
//   .get(authenticateToken, getUserById)
//   .patch(authenticateToken, updateUser)
//   .delete(authenticateToken, deleteUserById);

module.exports = router;
