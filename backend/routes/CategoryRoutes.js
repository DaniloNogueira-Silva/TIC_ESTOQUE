const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category');
const AdminAuth = require('../middleware/AdminAuth');

// Rotas de usuário
router.get('/', CategoryController.showAll);
router.post('/', CategoryController.create);
router.delete('/:id', CategoryController.remove);

module.exports = router;