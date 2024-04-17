const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const { uploadMusic, getMusicById, getMusics, listenMusic, updateMusicInformation, getTopMusic, deleteMusicById } = require('../../controllers/controllerClient/MusicController');

// Cấu hình multer để xử lý tải lên file nhạc
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Thư mục lưu trữ file nhạc
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Giữ nguyên tên file
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000000 },
    
});

// Route để lấy danh sách nhạc
router.get('/', getMusics);

// Route để tải lên file nhạc
router.post('/upload', upload.fields([{ name: 'musicFile', maxCount: 1 }, { name: 'imageFile', maxCount: 1 }]), uploadMusic);

router.get('/get/:id', getMusicById);

router.get('/listen/:id', listenMusic);

router.put('/update/:id', updateMusicInformation);

router.get('/top', getTopMusic);

router.delete('/delete/:id', deleteMusicById);
module.exports = router;
