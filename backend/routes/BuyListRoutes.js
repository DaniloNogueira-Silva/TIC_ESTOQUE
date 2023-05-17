const express = require('express');
const router = express.Router();
const BuyListController = require('../controllers/buylist');
const AdminAuth = require('../middleware/AdminAuth');


router.get('/', BuyListController.index);
router.post('/', BuyListController.create);
router.get('/buylistsearch', BuyListController.showBuyList);

module.exports = router;
