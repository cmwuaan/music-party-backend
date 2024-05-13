const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const authenticateToken = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    if (!req.user || !req.user.refreshToken || !req.user.user || !req.user.user._id) {
      return res.sendStatus(403).json({ message: 'Forbidden' });
    }

    try {
      jwt.verify(req.user.refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const accessToken = generateAccessToken(req.user.user);
      req.user.accessToken = accessToken;
      next();
    } catch (error) {
      return res.sendStatus(403).json({ message: 'Forbidden' });
    }
  }
};

module.exports = {
  generateAccessToken,
  authenticateToken,
};
