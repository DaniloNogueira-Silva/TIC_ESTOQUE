const {
  Budget,
  BudgetCompany,
  BudgetItems,
  BudgetPrice,
} = require("../models/Budget");

class BudgetController {
  async create(req, res) {
    try {
      const { name, file, responsible_name, cpf, rg, itens, empresas, precos } =
        req.body; // Destructure `itens`, `empresas`, and `precos` from `req.body`

      // Criar orçamento
      const budget = await Budget.create({
        name,
        file,
        responsible_name,
        cpf,
        rg,
      });

      // Criar valores
      const budgetPrices = await Promise.all(
        precos.map(async ({ descricao, valor, unidade }) => {
          return await BudgetPrice.create({
            descricao,
            valor,
            unidade,
          });
        })
      );

      // Adicionar empresas no orçamento
      const budgetCompanies = await Promise.all(
        empresas.map(async ({ razao_social, cnpj, telefone }) => {
          return await BudgetCompany.create({
            razao_social,
            cnpj,
            telefone,
          });
        })
      );

      // Adicionar os itens no orçamento
      const budgetItems = await Promise.all(
        itens.map(async ({ budgetCompanyId, budgetPriceId, budgetId }) => {
          return await BudgetItems.create({
            budgetCompanyId,
            budgetPriceId,
            budgetId,
          });
        })
      );

      const response = {
        id: budget.id,
        name: budget.name,
        file: budget.file,
        responsible_name: budget.responsible_name,
        cpf: budget.cpf,
        rg: budget.rg,
        itens: budgetItems.map((item) => ({
          id: item.id,
          budgetId: item.budgetId,
          budgetCompanyId: item.budgetCompanyId,
          budgetPriceId: item.budgetPriceId,
        })),
      };

      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar o orçamento" });
    }
  }

  async showAll(req, res) {
    try {
      const budgets = await BudgetItems.findAll({
      });
      res.status(200).json(budgets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar os orçamentos" });
    }
  }

  async remove(req, res) {
    let id = req.params.id
    await BudgetItems.destroy({ where: { budgetId: id } })

    await Budget.destroy({ where: { id: id } })
    
    try {
        res.status(200)
        res.send("Orçamento deletado")
    } catch (error) {
        res.status(406)
        res.send(error)
    }
  }

}

module.exports = new BudgetController();