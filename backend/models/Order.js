const Sequelize = require("sequelize")
const connection = require("../db")

const Order = connection.define('orders', {
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

//Order.sync({force: true})

module.exports = Order