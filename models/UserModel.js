const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
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
      required: [true, 'Please provide your gender'],
    },
    birth: {
      type: Date,
      required: [true, 'Please provide your birth'],
    },
    avatarUrl: {
      type: String,
      required: false,
      default: true,
    },
    accountType: {
      type: String,
      required: [true, 'Please provide your type'],
    },
    role: {
      type: String,
      required: [true, 'Please provide your role'],
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

const User = mongoose.model('User', userSchema);
module.exports = User;
