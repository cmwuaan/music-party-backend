const express = require('express');
const router = express.Router();

const {
  isLoggedIn,
  isSuccessLogin,
  isFailureLogin,
  Logout,
} = require('../../authentication/authController.js');

const {
  LoginAdmin,
} = require('../../controller/controllerAdmin/authAdminController.js');

// POST: Login Admin
router.route('/login').post(LoginAdmin);

// GET: Check login success
router.route('/success').get(isLoggedIn, isSuccessLogin);

// GET: Check login failure
router.route('/failure').get(isFailureLogin);

// GET: Logout
router.route('/logout').get(Logout);

module.exports = router;
