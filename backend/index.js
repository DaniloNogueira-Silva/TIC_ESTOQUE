const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connection = require("./db");
const router = require('./routes/routes');
const bodyParser = require("body-parser");

// models
const { default: models } = require("./models/models");

// banco
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com sucesso");
  })
  .catch((error) => {
    console.log(error);
  });

//middlewares
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//rotas
app.use('/', router);

//iniciando o server
const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server iniciado com sucesso");
});
