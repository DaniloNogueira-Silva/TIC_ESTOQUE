const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const AdminAuth = require('../middleware/AdminAuth');

router.post('/', UserController.create);
router.get('/', UserController.get);
router.get('/:id', UserController.findById);
router.delete('/:id', UserController.remove);
router.put('/:id', UserController.update);
router.post('/auth', UserController.login);
router.post('/recoverpassword/:id', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);

module.exports = router;