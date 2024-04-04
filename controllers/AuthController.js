const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
  const { email, password } = req.body.data;
  const user = await User.findOne({ email: email });

  if (!user) {
    // return res.redirect('/login');
    console.log('User not found');
  } else {
    bcrypt
      .compare(password, user.password)
      .then(() => {
        return res.status(200).json({ message: 'Login successful' });
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/auth/login');
      });
  }
};

module.exports = { loginUser };
