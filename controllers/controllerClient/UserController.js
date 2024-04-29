const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

const getUserList = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const user = await User.findOne({ username: email });

    if (user !== null) {
      return res.status(400).json({ message: 'User already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username: email,
        email: email,
        password: hashedPassword,
        displayName: displayName,
        avatarUrl: null,
        accountType: 'normal',
        gender: null,
        role: 'user',
      });

      try {
        await newUser.save();
        res.status(201).json({ user: newUser });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getUserList, createUser };
