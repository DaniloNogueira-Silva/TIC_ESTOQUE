const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userValidation = require("../validations/userValidations");

class UserController {

  async get(req, res){
    const users = await User.findAll()
    res.status(200).send(users);
  }

  async findById(req, res) {
    const id = req.params.id
    const user = await User.findOne({where:{id:id}})
    if(user == undefined){
      res.status(404).send({mesg:'Usuário não encontrado'})
    }else{
      res.status(200).send(user);
    }
  }

  async create(req, res) {
    try {
      await userValidation.validate(req.body)
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const isAdmin = req.body.isAdmin;

      await User.findOne({ where: { email: email } }).then((user) => {
        if (user == undefined) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(password, salt);

          User.create({
            name,
            email,
            password: hash,
            isAdmin,
          });
          res.status(200).send("Usuário cadastrado");
        }else {
          res.status(406).send({err: "Email já cadastrado"});
        }
      });
    } catch (error) {
      res.status(401).send(error);
    }
  };

  async remove(req,res){
    const id = req.params.id
    const user = await User.findOne({where:{id:id}})
    if(user == undefined){
      res.status(404).send({msg:'Usuário não encontrado'})
      return
    }else{
      res.status(200).send(user);
      const result = await User.destroy({where: {id:id}})
    }
  };

  async update(req, res){
    try {
      const {name, email, password, isAdmin} = req.body
      const id = req.params.id

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const result = await User.update({name: name, email: email, password: hash, isAdmin: isAdmin}, {
        where: {
          id: id
        }
      });
      res.status(200).send()
  
    } catch(error) {
      res.status(401).send(error)
    }
      
  }

  async login(req,res){
      const {email, password} = req.body

      const user = await User.findOne({where: { email: email
      }});

      if(user!= undefined){

        const result = await bcrypt.compare(password, user.password);

        if(result){
          const token = jwt.sign({email: user.email, isAdmin: user.isAdmin}, process.env.TOKEN_SECRET);

          res.status(200).send({token: token});
        }else {
          res.status(406).send("Credenciais incorretas");
        }
      }else{
        res.send("Erro.")
      }
  }
}

module.exports = new UserController();
