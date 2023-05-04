const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const CategoryController = require('../controllers/category');
const ProductController = require('../controllers/product')
const OrderController = require('../controllers/order');
const BuyListController = require('../controllers/buylist');
const AdminAuth = require('../middleware/AdminAuth');
const BudgetController = require('../controllers/budget');

//category
router.post('/admin/user', UserController.create);
router.get('/admin/category',AdminAuth, CategoryController.showAll);
router.post('/admin/category', AdminAuth, CategoryController.create);
router.delete('/admin/deleteCategory/:id', CategoryController.remove);

//product
router.get('/admin/product', ProductController.showAll);
router.post('/admin/product', ProductController.create);
router.delete('/admin/deleteProduct/:id', ProductController.remove);
router.post('/admin/editProduct/:id', ProductController.edit);

//user
router.post('/admin/user', UserController.create);
router.get('/admin/user', UserController.get);
router.get('/admin/user/:id', UserController.findById);
router.delete('/admin/user/:id', UserController.remove);
router.post('/admin/user/:id', UserController.update);
router.post('/auth', UserController.login);

//order
router.post('/admin/order', OrderController.create);
router.get('/admin/order', OrderController.showAll);
router.delete('/admin/order/:id', OrderController.remove);

//Buylist
router.get('/admin/buylist', BuyListController.index);
router.post('/admin/buylist', BuyListController.create);
router.get('/admin/buylistsearch', BuyListController.showBuyList);

//Budget
router.post('/admin/budget', BudgetController.create);
router.get('/admin/budget', BudgetController.showAll);
router.delete('/admin/budget/:id', BudgetController.remove);


module.exports = router;