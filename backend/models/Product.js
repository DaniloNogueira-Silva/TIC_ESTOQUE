const Sequelize = require('sequelize');
const connection = require('../db');
const Category = require("./Category")

const Product = connection.define('products', {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }, measure:{ //medida
        type: Sequelize.STRING,
        allowNull: false
    }, location:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

Product.belongsTo(Category)
Category.hasMany(Product)

//Product.sync({force: true})

module.exports = Product;