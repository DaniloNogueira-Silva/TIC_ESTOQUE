const Sequelize = require('sequelize');
const connection = require('../db');

const Category = connection.define('categories', {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

Category.sync({force: true})

module.exports = Category;