const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/budget');
const AdminAuth = require('../middleware/AdminAuth');

router.post('/', BudgetController.create);
router.get('/', BudgetController.showAll);
router.get('/:id', BudgetController.getById);
router.get('/budgetcompanies', BudgetController.showCompanies)

module.exports = router;
