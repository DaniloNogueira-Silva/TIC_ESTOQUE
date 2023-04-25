const Sequelize = require("sequelize");

const connection = new Sequelize("tic_estoque", process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  timezone: "-03:00",
});

module.exports = connection;
