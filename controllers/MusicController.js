const Music = require('../models/MusicModel');

const uploadMusic = async (req, res) => {
  try {
    const { musicName, genre, author, view, description, lyrics, url, imageUrl, releaseYear } = req.body;

    if (!musicName || !genre || !author || !description || !releaseYear) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const music = new Music({
      musicName: musicName,
      genre: genre,
      author: author,
      view: view,
      description: description,
      lyrics: lyrics,
      url: url,
      imageUrl: imageUrl,
      releaseYear: releaseYear,
    });

    try {
      await music.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

    res.status(201).json({ music: music });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getMusicList = async (req, res) => {
  try {
    const musics = await Music.find();
    res.json(musics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { uploadMusic, getMusicList };
