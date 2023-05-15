module.exports = models = () => {
  const {
    Budget,
    BudgetCompany,
    BudgetPrice,
    BudgetItems,
  } = require("./Budget");
  const BuyList = require("./BuyList");
  const Category = require("./Category");
  const Measure = require("./Measure");
  const { Order, OrderItem } = require("./Order");
  const Product = require("./Product");
  const { PasswordToken, User } = require("./User");
};
