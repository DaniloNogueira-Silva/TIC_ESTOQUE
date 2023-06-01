const {
  Budget,
  BudgetCompany,
  BudgetPrice,
} = require("../models/Budget");
const { companyValidation } = require("../validations/Validations");
const { Cpf, Cnpj, Phone } = require("br-helpers");
const pdf = require("html-pdf")

class BudgetController {
  async create(req, res) {
    try {
      const { name, file, responsible_name, cpf, rg, empresas, precos } = req.body;
      const validationCpf = Cpf.isValid(cpf);
      if (validationCpf == true) {
        Cpf.format(cpf);
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
          precos.map(async ({ descricao, valorA,valorB,valorC, unidade }) => {
            return await BudgetPrice.create({
              budgetId: budget.id,
              descricao,
              valorA,
              valorB,
              valorC,
              unidade,
            });
          })
        );
  
        // Adicionar empresas no orçamento
        const budgetCompanies = await Promise.all(
          empresas.map(async ({ razao_social, cnpj, telefone }) => {
            // const validacaoTelefone = Phone.isValid(telefone);
            // const validationCnpj = Cnpj.isValid(cnpj);
            // await companyValidation.validate({ razao_social });
            // if (validationCnpj == false || validacaoTelefone == false) {
            //   return res.status(401).send("Dados inválidos");
            // }
            // Cnpj.format(cnpj);
            // Phone.format(telefone);
            return await BudgetCompany.create({
              budgetId: budget.id,
              razao_social,
              cnpj,
              telefone,
            });
          })
        );
  
        return res.status(201).send("Orçamento criado");
      } else {
        return res.status(401).send("Número de CPF inválido");
      }
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Erro ao criar o orçamento" });
    }
  }
  

  async showAll(req, res) {
    try {
      const budgetItems = await Budget.findAll({
        include: [
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
      const budgetCompanies = await BudgetCompany.findAll({});

      res.status(200).json(budgetCompanies);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar as empresas" });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const budget = await Budget.findAll({
        where: { id: id },
        include: [
          { model: BudgetCompany },
          { model: BudgetPrice },
        ],
      });

      if (!budget) {
        return res
          .status(404)
          .json({ message: "Item de orçamento não encontrado" });
      }

      res.status(200).json(budget);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar o item de orçamento" });
    }
  }

  async printBudget(req, res) {
    try {
      const { id } = req.params;
      const conteudo = await Budget.findAll({
        where: { id: id },
        include: [
          { model: BudgetCompany },
          { model: BudgetPrice },
        ],
      });
  
      conteudo.forEach((budget) => {
        const dataBudget = {
          name: budget.name,
          responsible_name: budget.responsible_name,
          rg: budget.rg,
          cpf: budget.cpf
        } 
  
        const budgetCompanies = budget.budget_companies;
        const budgetPrices = budget.budget_prices;
        let texto = `<h1 style="color: red">A empresa ${dataBudget.name} fez um orçamento para as seguintes empresas: </h1>`;
  
        budgetCompanies.forEach((company) => {
          const dataCompany = {
            razaoSocial: company.razao_social,
            cnpj: company.cnpj,
            telefone: company.telefone,
          }
          texto += `- Razão Social: ${dataCompany.razaoSocial}, CNPJ: ${dataCompany.cnpj}, Telefone: ${dataCompany.telefone}<br>`;
        });
  
        budgetPrices.forEach((price) => {
          const dataPrice = {
            descricao: price.descricao,
            unidade: price.unidade,
            valorA: price.valorA,
            valorB: price.valorB,
            valorC: price.valorC
          }
          texto += `- Descrição: ${dataPrice.descricao}, Unidade: ${dataPrice.unidade}, Valor A: ${dataPrice.valorA}, Valor B: ${dataPrice.valorB}, Valor C: ${dataPrice.valorC}<br>`;
        });
  
        pdf.create(texto, {}).toFile(`../pdfs/${dataBudget.name}.pdf`, (err) => {
          if (err) {
            res.status(500).send("Erro ao fazer o pdf");
          } else {
            res.status(200).send("PDF criado");
          }
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  
}

module.exports = new BudgetController();
