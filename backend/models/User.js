const Sequelize = require('sequelize');
const connection = require('../db');
const user = require('../controllers/user');

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
    }, token:{
        type: Sequelize.STRING,
        allowNull: true
    }, used: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    } 
})

//User.sync({force: true})

module.exports = User;