const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order');
const AdminAuth = require('../middleware/AdminAuth');

router.post('/', OrderController.create);
router.get('/', OrderController.showAll);
router.delete('/:id', OrderController.remove);
router.get('/:id', OrderController.getById);
router.put('/quant', OrderController.updateQuantProd);
router.get('/latest', OrderController.latest);

module.exports = router;