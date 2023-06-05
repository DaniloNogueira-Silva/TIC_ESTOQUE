module.exports = models = () => {
  const {
    Budget,
    BudgetCompany,
    BudgetPrice,
    BudgetItems,
  } = require("./Budget");
  const Category = require("./Category");
  const Measure = require("./Measure");
  const { Order, OrderItem } = require("./Order");
  const Product = require("./Product");
  const  User  = require("./User");
};
