const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('/admin/user', UserController.create);

module.exports = router;