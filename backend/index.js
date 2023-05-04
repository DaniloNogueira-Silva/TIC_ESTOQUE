const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connection = require("./db");
const router = require('./routes/routes');
const bodyParser = require("body-parser");

// models
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Budget = require('./models/Budget');
const BuyList = require('./models/BuyList');

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
