const { authClientWeb } = require('../../authentication/auth.js');
const UserTable = require('../../entity/UserTable.js');

const loginUser = (req, res, next) => {
  authClientWeb.authenticate(UserTable.ROLE_USER, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Handle user not found
      return res.status(401).json({ message: 'Login failed' });
    }
    // Handle user found
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log(user);
      return res
        .status(200)
        .json({ success: true, message: 'Login successful', user: user });
    });
  })(req, res, next);
};

module.exports = { loginUser };
