const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const CategoryController = require('../controllers/category');
const ProductController = require("../controllers/product")

router.post('/admin/user', UserController.create);
router.get('/admin/category', CategoryController.showAll)
router.post('/admin/category', CategoryController.create);
router.delete('/admin/deleteCategory/:id', CategoryController.remove)
router.get('/admin/product', ProductController.showAll)
router.post('/admin/product', ProductController.create)
router.delete('/admin/deleteProduct/:id', ProductController.remove)
router.post('/admin/editProduct/:id', ProductController.edit)

module.exports = router;