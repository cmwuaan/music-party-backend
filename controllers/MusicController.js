const Music = require('../models/MusicModel');
const { uploadBytes, getDownloadURL } = require('firebase/storage');
const { firebaseStorage, ref } = require('../utils/Firebase');
// const asyncHandler = require('express-async-handler');
const uploadMusic = async (req, res) => {
  try {
    const { musicName, genre, author, view, description, lyrics, releaseYear } = req.body;

    if (!musicName || !genre || !author || !description || !releaseYear) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Lấy file nhạc từ yêu cầu
    const musicFile = req.file;
    if (!musicFile) {
      return res.status(400).json({ message: 'Please upload a music file' });
    }

    // Tải file nhạc lên Firebase Storage
    const storageRef = ref(firebaseStorage, `music/${musicFile.originalname}`);
    const snapshot = await uploadBytes(storageRef, musicFile.buffer);

    // Lấy URL của file nhạc đã tải lên
    const url = await getDownloadURL(snapshot.ref);

    // Tạo một đối tượng Music với thông tin từ req.body và URL của file nhạc
    const music = new Music({
      musicName,
      genre,
      author,
      view,
      description,
      lyrics,
      url,
      releaseYear,
    });

    // Lưu thông tin nhạc vào MongoDB
    await music.save();

    res.status(201).json({ music });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const getMusics = async (req, res) => {
  try {
    const musics = await Music.find();
    res.json(musics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const listenMusic = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    music.view += 1;
    await music.save();
    res.json(music);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');

  }
};


module.exports = { uploadMusic, getMusics, listenMusic };
