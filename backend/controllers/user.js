const User = require("../models/User");
const bcrypt = require("bcrypt");

class UserController {
  async create(req, res) {
    try {
      let name = req.body.name;
      let email = req.body.email;
      let password = req.body.password;
      let isAdmin = req.body.isAdmin;

      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);

      await User.create({
        name,
        email,
        password: hash,
        isAdmin,
      });
      res.status(200);
      res.send("Usuário cadastrado");
    } catch (error) {
      res.status(401).send(error);
    }
  }
}

module.exports = new UserController();
