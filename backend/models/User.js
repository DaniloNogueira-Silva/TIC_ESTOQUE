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
    }
})

//User.sync({force: true})

const PasswordToken = connection.define('passwordTokens', {
    token:{
        type: Sequelize.STRING,
        allowNull: false
    }, used: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    } 
})

PasswordToken.belongsTo(User)
User.hasMany(PasswordToken)
//PasswordToken.sync({force: true})

module.exports = {User, PasswordToken};