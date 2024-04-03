const Music = require('../model/Music');
const path = require('path');
const fs = require('fs');
const {GridFsStorage} = require('multer-gridfs-storage');
const uploadMusic = async (req, res) => {
  try {
    const { title, artist, genre, description, lyrics, audio, image } = req.body;
      
    const music = new Music({
      title,
      artist,
      genre,
      description,
      lyrics,
      audio,
      image,
    });
      
      
      

    await music.save();
    res.status(201).json({ message: 'Music uploaded successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { uploadMusic };