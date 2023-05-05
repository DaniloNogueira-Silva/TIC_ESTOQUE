const Sequelize = require('sequelize');
const connection = require('../db');
const Product = require("./Product")

const Order = connection.define('orders', {
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expected_date: {
        type: Sequelize.DATE,
        allowNull:false
    }
    //adicionar outras colunas conforme necessário
})

const OrderItem = connection.define('order_items', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // adicionar outras colunas conforme necessário
})

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

OrderItem.hasMany(Order);
Order.belongsTo(OrderItem);

//Order.sync({force: true})
//OrderItem.sync({force: true})

module.exports = { Order, OrderItem}
