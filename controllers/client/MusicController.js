const Music = require('../../models/MusicModel');
const { uploadBytes, getDownloadURL } = require('firebase/storage');
const { firebaseStorage, ref } = require('../../utils/firebaseConfig');
const { update } = require('firebase/database');
// const asyncHandler = require('express-async-handler');

const getAllMusics = async (req, res) => {
  try {
    const musics = await Music.find();
    res.status(200).json({
      status: 'success',
      results: musics.length,
      data: {
        musics,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const uploadMusic = async (req, res) => {
  try {
    const { musicName, genre, author, view, description, lyrics, releaseYear } = req.body;

    if (!musicName || !genre || !author || !description || !releaseYear) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Lấy file nhạc từ yêu cầu
    const musicFile = req.files['musicFile'][0];
    console.log('filesize', musicFile.size);
    if (!musicFile) {
      return res.status(400).json({ message: 'Please upload a music file' });
    }
    const imageFile = req.files['imageFile'][0];
    if (!imageFile) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    // Tải file nhạc lên Firebase Storage
    const musicFileData = musicFile.buffer || musicFile.data;
    const storageRef = ref(firebaseStorage, `music/${musicFile.originalname}`);
    const snapshot = await uploadBytes(storageRef, musicFileData);
    console.log('snapshot', snapshot);

    const imageRef = ref(firebaseStorage, `image/${imageFile.originalname}`);
    const imageSnapshot = await uploadBytes(imageRef, imageFile.buffer);

    // Lấy URL của file nhạc đã tải lên
    const url = await getDownloadURL(snapshot.ref);
    const imageUrl = await getDownloadURL(imageSnapshot.ref);
    // Tạo một đối tượng Music với thông tin từ req.body và URL của file nhạc
    const music = new Music({
      musicName,
      genre,
      author,
      view,
      description,
      lyrics,
      url,
      imageUrl,
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

const getMusicById = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    // console.log(music);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    res.json(music);
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

const updateMusicInformation = async (req, res) => {
  try {
    const { musicName, genre, author, description, lyrics, releaseYear } = req.body;

    if (!musicName || !genre || !author || !description || !releaseYear) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }

    music.musicName = musicName;
    music.genre = genre;
    music.author = author;
    music.description = description;
    music.lyrics = lyrics;
    music.releaseYear = releaseYear;

    await music.save();

    res.json(music);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getTopMusic = async (req, res) => {
  try {
    const quantity = 20;
    const index = req.query.index ? parseInt(req.query.index) : 0;
    const musics = await Music.find().sort({ view: -1 }).skip(index).limit(quantity);
    res.json(musics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteMusicById = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    await music.deleteOne(); // or music.deleteMany() if deleting multiple documents
    res.json({ message: 'Music removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllMusics,
  uploadMusic,
  getMusicById,
  listenMusic,
  updateMusicInformation,
  getTopMusic,
  deleteMusicById,
};
