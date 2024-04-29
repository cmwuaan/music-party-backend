const mongoose = require('mongoose');

const musicGenreSchema = new mongoose.Schema(
  {
    musicGenre: {
      type: String,
      required: [true, 'Please provide a music genre'],
    },
    musicQuantity: {
      type: Number,
      default: 1,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    view: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Genre', musicGenreSchema);
