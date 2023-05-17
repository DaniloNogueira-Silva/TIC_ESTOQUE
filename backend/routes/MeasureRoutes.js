const express = require('express');
const router = express.Router();
const MeasureController = require('../controllers/measure');
const AdminAuth = require('../middleware/AdminAuth');

router.post('/', MeasureController.create);
router.get('/', MeasureController.showAll);

module.exports = router;


