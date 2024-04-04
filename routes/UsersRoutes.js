const express = require('express');
const router = express.Router();
const { getUserList, createUser } = require('../controllers/UserController');

router.get('/', getUserList);
router.post('/create', createUser);

module.exports = router;
