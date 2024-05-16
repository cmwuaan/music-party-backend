const UserTable = require('../../entity/UserTable.js');
const { authAdminWeb } = require('../../authentication/auth.js');

const LoginAdmin = (req, res, next) => {
  authAdminWeb.authenticate(UserTable.ROLE_ADMIN, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Handle when user is not found
      return res.status(401).json({ message: 'Login failed' });
    }
    // Handle when user is found
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

module.exports = { LoginAdmin };
