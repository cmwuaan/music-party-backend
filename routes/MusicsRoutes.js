const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const { uploadMusic, getMusics, listenMusic } = require('../controllers/MusicController');

// Cấu hình multer để xử lý tải lên file nhạc
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Thư mục lưu trữ file nhạc
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Giữ nguyên tên file
  }
});

const upload = multer({ storage: storage });

// Route để lấy danh sách nhạc
router.get('/', getMusics);

// Route để tải lên file nhạc
router.post('/upload', upload.single('musicFile'), uploadMusic);

router.get('/listen/:id', listenMusic);

module.exports = router;
