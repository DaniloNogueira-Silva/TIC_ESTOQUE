const Sequelize = require('sequelize');
const connection = require('../db');

const BuyList = connection.define('buylist', {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//BuyList.sync({force: true})

module.exports = BuyList;