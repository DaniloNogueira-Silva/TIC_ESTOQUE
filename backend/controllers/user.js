const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {userValidation, passwordValidation} = require("../validations/Validations");
const nodemailer = require("nodemailer")

class UserController {

  async get(req, res) {
    const users = await User.findAll()
    res.status(200).send(users);
  }

  async findById(req, res) {
    const id = req.params.id
    const user = await User.findOne({ where: { id: id } })
    if (user == undefined) {
      res.status(404).send({ mesg: 'Usuário não encontrado' })
    } else {
      res.status(200).send(user);
    }
  }

  async create(req, res) {
    try {
      await userValidation.validate(req.body)
      const {name, email, password, isAdmin } = req.body;

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
        } else {
          res.status(406).send({ err: "Email já cadastrado" });
        }
      });
    } catch (error) {
      res.status(401).send(error);
    }
  };

  async remove(req, res) {
    const id = req.params.id
    const user = await User.findOne({ where: { id: id } })
    if (user == undefined) {
      res.status(404).send({ msg: 'Usuário não encontrado' })
      return
    } else {
      res.status(200).send(user);
      const result = await User.destroy({ where: { id: id } })
    }
  };

  async update(req, res) {
    try {
      const { name, email, password, isAdmin } = req.body
      const id = req.params.id

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const result = await User.update({ name: name, email: email, password: hash, isAdmin: isAdmin }, {
        where: {
          id: id
        }
      });
      res.status(200).send()

    } catch (error) {
      res.status(401).send(error)
    }

  }

  async login(req, res) {
    const { email, password } = req.body

    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if (user != undefined) {

      const result = await bcrypt.compare(password, user.password);

      if (result) {
        const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, process.env.TOKEN_SECRET);

        res.status(200).send({ token: token });
      } else {
        res.status(406).send("Credenciais incorretas");
      }
    } else {
      res.send("Erro.")
    }
  }

  async recoverPassword(req, res) {
    const email = req.body.email
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    if (user != undefined) {
      try {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let token = ""
        for (let i = 0, n = charset.length; i <= 10 ; i++) {
          token += charset.charAt(Math.floor(Math.random() * n))  
        }
        
        await User.update({
          token: token // UUID
        }, {
          where: {
            email: email
          }
        });

        const transport = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'igorpcampos2004@gmail.com',
            pass: 'btdlktpkigrntpkk'
          }
        })
        transport.sendMail({
          from: 'Projeto TIC <igorpcampos2004@gmail.com>',
          to: `${email}`,
          subject: 'Enviando email de recuperação de senha',
          html: `<h1>Olá, copie esse código ${token} para redefinir sua senha</h1>`,
          text: `Olá, copie esse código ${token} para redefinir sua senha`
        }).then(() => console.log("Email enviado com sucesso"))
        .catch((err) => console.log(`Erro ao enviar email ${err}`))
        
        res.status(200).send({token})
      } catch (err) {
        console.log(err);
      }
    } else {
      res.status(400).send("Email não existe")
    }
  }

  async changePassword(req, res) {
    await passwordValidation.validate(req.body)
    let token = req.body.token;
    const password = req.body.password;
    let status = false
    let isTokenValid
    try {
      isTokenValid = await User.findOne({
        where: {
          token: token
        },
        raw: true
      });

      if (isTokenValid != undefined) {
        
        if (isTokenValid.used) {
          status = false
        } else {
          status = true
          token = isTokenValid.token
        }
      } else {
        return { status: false };
      }
    } catch (err) {
      console.log(err);
      return { status: false };
    }
    if (status) {
        const newPassword = password
        const id = isTokenValid.id
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        await User.update({password: hash, used: 1}, {where: {id: id}} );
        res.status(200).send("Senha alterada");
      } else {
        res.status(406).send("Token inválido!");
      }
  }
}

module.exports = new UserController();