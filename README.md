# TIC_ESTOQUE - Passo a Passo de como instalar o projeto:

## Iniciando o projeto com o git

1) Crie uma pasta com o nome TIC-ESTOQUE
2) Abre o terminal do VSCODE
3) Digite os seguintes comandos do git:
  - git init
  - git remote add origin https://github.com/DaniloNogueira-Silva/TIC_ESTOQUE
  - git branch -M main (para verificar se está na branch main)
  - git pull origin main (para trazer todos os arquivos que estão no repositório na núvem)
  - se não der chama o Éder :)
4) Sempre que adicionar ou alterar algo do projeto, suba as mudanças para o repositório na núvem

## Iniciando o projeto backend

1) Abre o terminal do VSCODE
2) digite o comando: "cd backend"
3) digite o comando: "npm i" para instalar as depêndencias do projeto
4) ainda dentro do backend, crie o arquivo .env
5) O .env deve conter as seguintes informações:
  - PORT = ex:1234
  - DB_HOST = ex:"localhost"
  - DB_USER = ex:"nomeDeUsuárioDoMYSQL"
  - DB_PASSWORD =  ex:"senhaDoUsuárioDoMYSQL"
  - TOKEN_SECRET = ex:"escrevaUmMonteDeCaractereAleatório"
6) Abre o MYSQL e crie um banco de dados chamado "tic_estoque"
7) Use o comando npm start no terminal para rodar o projeto backend

## Parâmetro das requisições

1) Create User: 

  {
    "email": "string",
    "password": "string",
    "name": "string",
    "isAdmin": boolean

  }

2) Create Measure:

  {
    "unit_measure": "string",
  }

3) Create Category:

  {
    "name": "string",
  }
4) Create Product:

  {
    "name": "string",
    "location": "string",
    "quantity": number,
    "categoryId": number - id de uma categoria existente,
    "measureId": number - id de uma measure existente
  }

5) Create Buylist:

  {
    "name": "string",
  }

6) Create Order:

  {
    "status":
    "expected_date":
    "items": [
      {
        "productId": "number - id de um produto existente",
        "quantityInStock": number,
        "newQuantity": number
      }
    ]

  }

7) Create Budget:

  {
    "name": "string",
    "file": "string",
    "responsible_name": "string",
    "cpf": "number",
    "rg": "number",
    "precos": [
        {
            "descricao":  "string",
            "valor": "number",
            "unidade": "number"
        }
    ],
    "empresas": [
        {
            "razao_social": "string",
            "cnpj": "number",
            "telefone": "number"
        } 
    ],
    "itens": [
        {
            "budgetCompanyId": "number",
            "budgetPriceId": "number",
            "budgetId": "number"
        }
    ]

       
}

