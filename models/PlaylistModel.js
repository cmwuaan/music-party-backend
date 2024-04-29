const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema(
  {
    playlistName: {
      type: String,
      required: [true, 'Please provide a playlist name'],
    },
    listMusic: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: 'Music',
    },
    avatarPlaylist: {
      type: String,
      default: '',
    },
    ownerPlaylistID: {
      type: String, /// temp value
      // type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide owner id'],
      ref: 'User',
    },
    view: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Playlist', playlistSchema);
