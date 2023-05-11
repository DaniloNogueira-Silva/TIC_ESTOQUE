const {
  BudgetItems,
  Budget,
  BudgetCompany,
  BudgetPrice,
} = require("../models/Budget");
const {companyValidation} = require("../validations/Validations");
const {Cpf, Cnpj, Phone} = require("br-helpers")

class BudgetController {
  async create(req, res) {
    try {
      const { name, file, responsible_name, cpf, rg, itens, empresas, precos } =
        req.body; // Destructure `itens`, `empresas`, and `precos` from `req.body`
      const validationCpf = Cpf.isValid(cpf)
      if (validationCpf == true) {
        Cpf.format(cpf)
        // Criar orçamento
        const budget = await Budget.create({
          name,
          file,
          responsible_name,
          cpf,
          rg,
        });
      } else {
        return res.status(401).send("Número de cpf inválido")
      }
      
      

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
          const validacaoTelefone = Phone.isValid(telefone)
          const validationCnpj = Cnpj.isValid(cnpj)
          await companyValidation.validate({razao_social})
          if (validationCnpj == false || validacaoTelefone == false) {
            return res.status(401).send("Dados inválidos")
          }
          Cnpj.format(cnpj)
          Phone.format(telefone)
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

      if (res.headersSent) {
        return;
      }
      return res.status(201).send("Orçamento criado")
    } catch (error) {
      return res.status(400).send({ message: "Erro ao criar o orçamento" });
    }
  }

  async showAll(req, res) {
    try {
      const budgetItems = await BudgetItems.findAll({
        include: [
          { model: Budget },
          { model: BudgetCompany },
          { model: BudgetPrice },
        ],
      });

      res.status(200).json(budgetItems);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar os orçamentos" });
    }
  }

  async showCompanies(req, res) {
    try {
      const budgetCompanies = await BudgetCompany.findAll({
      });

      res.status(200).json(budgetCompanies);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar as empresas" });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const budgetItem = await BudgetItems.findAll({where: {budgetId: id},
        include: [
          { model: Budget },
          { model: BudgetCompany },
          { model: BudgetPrice },
        ],
      });

      if (!budgetItem) {
        return res
          .status(404)
          .json({ message: "Item de orçamento não encontrado" });
      }

      res.status(200).json(budgetItem);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar o item de orçamento" });
    }
  }
}

module.exports = new BudgetController();
