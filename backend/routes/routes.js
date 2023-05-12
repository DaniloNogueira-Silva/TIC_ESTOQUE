const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const CategoryController = require('../controllers/category');
const ProductController = require('../controllers/product')
const OrderController = require('../controllers/order');
const BuyListController = require('../controllers/buylist');
const AdminAuth = require('../middleware/AdminAuth');
const BudgetController = require('../controllers/budget');
const MeasureController = require('../controllers/measure');

//category
router.post('/admin/user', UserController.create);
router.get('/admin/category', CategoryController.showAll);
router.post('/admin/category', CategoryController.create);
router.delete('/admin/category/:id', CategoryController.remove);

//product
router.get('/admin/product', ProductController.showAll);
router.post('/admin/product', ProductController.create);
router.delete('/admin/product/:id', ProductController.remove);
router.put('/admin/product', ProductController.edit);

//user
router.post('/admin/user', UserController.create);
router.get('/admin/user', UserController.get);
router.get('/admin/user/:id', UserController.findById);
router.delete('/admin/user/:id', UserController.remove);
router.post('/admin/user/:id', UserController.update);
router.post('/auth', UserController.login);
router.post('/recoverpassword/:id', UserController.recoverPassword)
router.post('/changepassword', UserController.changePassword)

//order
router.post('/admin/order', OrderController.create);
router.get('/admin/order', OrderController.showAll);
router.delete('/admin/order/:id', OrderController.remove);
router.get('/admin/order/:id', OrderController.getById);
router.put('/admin/order/quant', OrderController.updateQuantProd);
router.get('/admin/latest', OrderController.latest);

//Buylist
router.get('/admin/buylist', BuyListController.index);
router.post('/admin/buylist', BuyListController.create);
router.get('/admin/buylistsearch', BuyListController.showBuyList);

//Budget
router.post('/admin/budget', BudgetController.create);
router.get('/admin/budget', BudgetController.showAll);
router.get('/admin/budget/:id', BudgetController.getById);
router.get('/admin/budgetcompanies', BudgetController.showCompanies)

//Measure
router.post('/admin/measure', MeasureController.create);
router.get('/admin/measure', MeasureController.showAll);




module.exports = router;