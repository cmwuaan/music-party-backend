require('dotenv').config();
const CLIENT_URL = process.env.CLIENT_URL;
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.status(401).json({ message: 'Unauthorized' });
};

const isSuccessLogin = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const existingUser = await User.findById(req.user.user._id);
    if (existingUser === null) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (existingUser.refreshToken !== req.user.refreshToken) {
      req.logout();
      req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.status(200).json({
      success: true,
      message: 'Success',
      user: req.user,
    });
  }
});

const isFailureLogin = (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure',
  });
};

const Logout = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
        }
        res.status(200).json({
          success: true,
          message: 'Success',
        });
      });
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }
};

module.exports = { isLoggedIn, isSuccessLogin, isFailureLogin, Logout };
