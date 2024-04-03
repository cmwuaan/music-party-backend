const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musicSchema = new Schema(
  {
    musicName: {
      type: String,
      required: [true, 'Please provide a music name'],
    },
    genre: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: [true, 'Please provide an author name'],
    },
    view: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    lyrics: {
      type: String,
      default: 'No lyrics provided',
    },
    url: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    releaseYear: {
      type: Number,
      required: [true, 'Please add the release year of your music'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Music', musicSchema);
