const UserTable = require('../../entity/UserTable');
const User = require('../../models/UserModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const moment = require('moment');

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const usersList = await User.find().select('email name role gender createdAt updatedAt');
    const mapUsersList = usersList.map((user) => ({
      id: user._id,
      name: user.displayName,
      email: user.email,
      role: user.role,
      gender: user.gender,
      'Created date': moment(user.createdAt).format('DD/MM/YY - HH:mm:ss'),
    }));
    return res.status(200).json({
      status: 'success',
      results: usersList.length,
      data: {
        userList: mapUsersList,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

const createUser = asyncHandler(async (req, res) => {
  try {
    const { email, password, passwordConfirm, name, gender, birth } = req.body;

    if (!email || !password || !passwordConfirm || !name || !gender || !birth) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser !== null) {
      return res.status(400).json({ message: 'Email already exists' });
    } else if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Password do not match' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        gender: gender,
        birth: birth,
        avatarUrl: null,
        accountType: UserTable.SUBSCRIPTION.free,
        role: UserTable.CLIENT_ROLE,
        isAvailable: true,
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
});
const deleteAllUser = async (req, res) => {};

const getUserById = asyncHandler(async (req, res) => {});
const updateUser = asyncHandler(async (req, res) => {});
const searchUser = asyncHandler(async (req, res) => {});
const deleteUserById = asyncHandler(async (req, res) => {});

module.exports = {
  getAllUser,
  createUser,
  deleteAllUser,
  getUserById,
  updateUser,
  searchUser,
  deleteUserById,
};
