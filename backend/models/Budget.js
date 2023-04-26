const Sequelize = require('sequelize');
const connection = require('../db');

const Budget = connection.define('budgets', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }, reason: { //Motivo
        type: Sequelize.STRING,
        allowNull: false
    }, value1: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, value2: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, value3: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, company1: {
        type: Sequelize.STRING,
        allowNull: false
    }, company2: {
        type: Sequelize.STRING,
        allowNull: false
    }, company3: {
        type: Sequelize.STRING,
        allowNull: false
    }, file: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Budget.sync({ force: true })

module.exports = Budget;