const { Budget, BudgetCompany, BudgetPrice } = require("../models/Budget");
const { companyValidation } = require("../validations/Validations");
const { Cpf, Cnpj, Phone } = require("br-helpers");
const moment = require('moment');
const pdf = require("html-pdf");

class BudgetController {
  async create(req, res) {
    try {
      const { name, file, responsible_name, cpf, rg, empresas, precos } =
        req.body;
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
          precos.map(async ({ descricao, valorA, valorB, valorC, unidade }) => {
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
        include: [{ model: BudgetCompany }, { model: BudgetPrice }],
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
        include: [{ model: BudgetCompany }, { model: BudgetPrice }],
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
        include: [{ model: BudgetCompany }, { model: BudgetPrice }],
      });

      conteudo.forEach((budget) => {
        const dataBudget = {
          name: budget.name,
          responsible_name: budget.responsible_name,
          rg: budget.rg,
          cpf: budget.cpf,
          createdAt: budget.createdAt
        };

        const data = dataBudget.createdAt// Exemplo de data do campo createdAt

        const date = new Date(data);
        const formattedDate = new Intl.DateTimeFormat("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(date);
        


        const budgetCompanies = budget.budget_companies;
        const budgetPrices = budget.budget_prices;
        let texto = `
            <h4 style="color: gray; text-align: center; margin-top: 100px "> NV SOCIEDADE SOLIDÁRIA </h4>
            <p style="color: gray; text-align: center "> Gestora do CCI Nossa Senhora da Conceição </p>
            <p style="color: gray; text-align: center "> CNPJ n. 05.166.687/0002-34 </p>
            <p style="font-weight: bold; text-align: center ">CONSOLIDAÇÃO DE PESQUISAS DE PREÇOS</p>

            <p  style=" margin-left: 50px ">ORGÃO CONCESSOR: Prefeitura Municipal de Franca </p>
            <p  style=" margin-left: 50px ">ENTIDADE CONVENIADA: NV Sociedade Solidária (CCI Municipal Nossa senhora da Conceição)</p>
            <p  style=" margin-left: 50px ">EXERCÍCIO: 2023</p>
            <table style="border-collapse: collapse; width: 90%; margin-left: auto; margin-right: auto ">
              <tr>
                <th colspan="2" style="border: 1px solid black; padding: 8px; text-align: center;"
                  >I – IDENTIFICAÇÃO DOS PROPONENTES (Fornecedores de Produtos)
                </th>
                
              </tr>
          `;

        budgetCompanies.forEach((company, index) => {
          const dataCompany = {
            razaoSocial: company.razao_social,
            cnpj: company.cnpj,
            telefone: company.telefone,
          };

          let letra = String.fromCharCode(66 + index - 1);
          
          texto += 
          `
              <tr>
                <td style="border: 1px solid black; padding: 8px; text-align: left; width: 130px ">
                  PROPOENTE (${letra})
                </td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">
                  Razão Social: ${dataCompany.razaoSocial}<br> CNPJ: ${dataCompany.cnpj}<br> Telefone: ${dataCompany.telefone}
                </td>
              </tr>
  
          `
        });

        texto += `
         </table>
         <table style="border-collapse: collapse; width: 90%; margin-left: auto; margin-right: auto; margin-top: 30px ">
          <tr>
            <th colspan="6" style="border: 1px solid black; padding: 8px; text-align: center;">
              II – PROPOSTAS (R$)
            </th>
          </tr>
          <tr>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Item
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Descrição dos Produtos e Serviços
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Unid.
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Valor Prop. (A)
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Valor Prop. (B)
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Valor Prop. (C)
            </th>
          </tr>
        `

        //Iniciano as variaveis
        let totalA = 0
        let totalB = 0
        let totalC = 0

        budgetPrices.forEach((price, index) => {
          const dataPrice = {
            descricao: price.descricao,
            unidade: price.unidade,
            valorA: price.valorA,
            valorB: price.valorB,
            valorC: price.valorC,
          };

          

          texto += `
            <tr>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${index + 1}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${dataPrice.descricao}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${dataPrice.unidade}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${dataPrice.valorA}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${dataPrice.valorB}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${dataPrice.valorC}
              </td>
            </tr>
          `
          
            totalA += dataPrice.unidade * dataPrice.valorA
            totalB += dataPrice.unidade * dataPrice.valorB
            totalC += dataPrice.unidade * dataPrice.valorC
          
          
        });


        texto += 
        `
            <tr>
              <td colspan="3" style="border: 1px solid black; padding: 8px; text-align: center;"> Valor Total da Proposta </td>
              <td  style="border: 1px solid black; padding: 8px; text-align: center;"> R$ ${totalA} </td>
              <td  style="border: 1px solid black; padding: 8px; text-align: center;"> R$ ${totalB} </td>
              <td  style="border: 1px solid black; padding: 8px; text-align: center;"> R$ ${totalC} </td>
            </tr>
          </table>
          <table style="border-collapse: collapse; width: 90%; margin-left: auto; margin-right: auto; text-align: center; margin-top: 30px ">
            <tr>
              <th  style="border: 1px solid black; padding: 8px; text-align: center;"> III- OBSERVAÇÕES/JUSTIFICATIVAS </th>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 8px; text-align: center;"> Realizado Orçamento nas três empresas a Proponente (A), (B) e (C). Optamos pela Prononente (A)
                por apresentar o menor valor.
              </td>
            </tr>
          </table>

          <p style="border: 1px solid black; width: 90%; text-align: center; margin-left: auto; margin-right: auto;"> IV- AUTENTICAÇÃO </p>
          <p style="margin-left: 50px ; "> Local e Data: Franca, de ${formattedDate} </p>
          <p style="margin-left: 50px ; "> Nome do Responsável: ${budget.responsible_name} - R.G:  ${budget.rg} - CPF:  ${budget.cpf} </p>
          <p style="margin-left: 50px ; "> Assinatura: ______________________________________________________________________ </p>
        `

        pdf
          .create(texto, {})
          .toFile(`./pdfs/${dataBudget.name}.pdf`, (err) => {
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
