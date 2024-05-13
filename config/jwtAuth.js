const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
require('dotenv').config();

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

const authenticateToken = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorize' });
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorize' });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    res.status(403).json({ message: 'Forbidden' });
  }

  const existingUser = await User.findOne({ refreshToken: req.user.refreshToken, _id: req.user.user._id });
  if (!existingUser) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const accessToken = generateAccessToken(req.user.user);
    req.user.accessToken = accessToken;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

module.exports = { authenticateToken, generateAccessToken };
