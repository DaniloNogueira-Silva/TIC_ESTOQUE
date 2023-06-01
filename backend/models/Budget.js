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

const BudgetPrice = connection.define('budget_price', {
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    unidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    valorA: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    valorB: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    valorC: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

Budget.hasMany(BudgetCompany);
Budget.hasMany(BudgetPrice);

// Adiciona as chaves estrangeiras às tabelas
BudgetCompany.belongsTo(Budget);
BudgetPrice.belongsTo(Budget);

// Sincroniza as tabelas
//Budget.sync({ force: true })
//BudgetCompany.sync({ force: true })
//BudgetPrice.sync({ force: true })

module.exports = { Budget, BudgetCompany, BudgetPrice};


