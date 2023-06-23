const Sequelize = require('sequelize');
const connection = require('../db');
const Category = require("./Category");
const Measure = require('./Measure');

const Product = connection.define('products', {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }, location:{
        type: Sequelize.STRING,
        allowNull: false
    }, quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, purchase_allowed: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }, originCityHall: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

Product.belongsTo(Category)
Category.hasMany(Product)

Product.belongsTo(Measure);
Measure.hasMany(Product);

//Product.sync({force: true})

module.exports = Product;