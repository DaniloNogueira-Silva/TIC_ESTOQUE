const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const CategoryController = require('../controllers/category');
const ProductController = require("../controllers/product")

//category
router.post('/admin/user', UserController.create);
router.get('/admin/category', CategoryController.showAll)
router.post('/admin/category', CategoryController.create);
router.delete('/admin/deleteCategory/:id', CategoryController.remove)

//product
router.get('/admin/product', ProductController.showAll)
router.post('/admin/product', ProductController.create)
router.delete('/admin/deleteProduct/:id', ProductController.remove)
router.post('/admin/editProduct/:id', ProductController.edit)

//user
router.post('/admin/user', UserController.create);
router.get('/admin/user', UserController.get);
router.get('/admin/user/:id', UserController.findById);
router.delete('/admin/user/:id', UserController.remove);
router.post('/admin/user/:id', UserController.update);
router.post('/auth', UserController.login);

module.exports = router;