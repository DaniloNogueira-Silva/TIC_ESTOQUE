const Sequelize = require('sequelize');
const connection = require('../db');

const Measure = connection.define('measures', {
    unit_measure: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Measure.sync({force: true})

module.exports = Measure
