const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    username: {
      type: String,
      required: false,
      default: null,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please add your email'],
    },
    displayName: {
      type: String,
      required: [true, 'Please add your password'],
    },
    googleId: {
      type: String,
      required: false,
      default: null,
    },
    facebookId: {
      type: String,
      required: false,
      default: null,
    },

    gender: {
      type: String,
      required: false,
    },
    birth: {
      type: Date,
      required: false,
    },
    avatarUrl: {
      type: String,
      required: false,
      default: true,
    },
    accountType: {
      type: String,
      required: [true, 'Please add you type'],
    },
    role: {
      type: String,
      required: [true, 'Please add your role'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
