const Sequelize = require('sequelize');
const connection = require('../db');

const User = connection.define('users', {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }, email:{
        type: Sequelize.STRING,
        allowNull: false
    }, password:{
        type: Sequelize.STRING,
        allowNull: false
    }, isAdmin:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

//User.sync({force: true})

module.exports = User;