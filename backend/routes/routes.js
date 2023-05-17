const express = require('express');
const router = express.Router();
const productRouter = require('./ProductRoutes');
const userRouter = require('./UserRoutes');
const categoryRouter = require('./CategoryRoutes')
const orderRouter = require('./OrderRoutes')
const buyListRouter = require('./BuyListRoutes')
const budgetRouter = require('./BudgetRoutes')
const measureRouter = require('./MeasureRoutes')

// Rotas principais
router.use('/admin/product', productRouter);
router.use('/admin/user', userRouter);
router.use('/admin/category', categoryRouter);
router.use('/admin/order', orderRouter)
router.use('/admin/buylist', buyListRouter)
router.use('/admin/budget', budgetRouter)
router.use('/admin/measure', measureRouter)

module.exports = router;





