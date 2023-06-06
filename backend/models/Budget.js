const Sequelize = require('sequelize');
const connection = require('../db');

const Budget = connection.define('budgets', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }, responsible_name: {
        type: Sequelize.STRING,
        allowNull: false
    }, rg: {
        type: Sequelize.STRING,
        allowNull: false
    }, cpf: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const BudgetCompany = connection.define('budget_company', {
    razao_social: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cnpj: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telefone: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const BudgetPrice = connection.define('budget_prices', {
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    unidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    valor: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

const BudgetItems = connection.define('budget_items', {

});





// Adiciona as chaves estrangeiras às tabelas
BudgetItems.belongsTo(BudgetCompany);
BudgetItems.belongsTo(BudgetPrice);
BudgetItems.belongsTo(Budget);

Budget.hasMany(BudgetItems);
BudgetCompany.hasMany(BudgetItems);
BudgetPrice.hasMany(BudgetItems);


// Sincroniza as tabelas
//Budget.sync({ force: true })
//BudgetCompany.sync({ force: true })
//BudgetPrice.sync({ force: true })
//BudgetItems.sync({ force: true })

module.exports = { Budget, BudgetCompany, BudgetPrice, BudgetItems};


