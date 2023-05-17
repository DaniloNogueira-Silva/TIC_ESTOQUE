const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product');
const AdminAuth = require('../middleware/AdminAuth');

router.get('/', ProductController.showAll);
router.post('/', ProductController.create);
router.get('/:id', ProductController.getById);
router.delete('/:id', ProductController.remove);
router.put('/', ProductController.edit);

module.exports = router;