const Product = require("../models/Product");
const Category = require("../models/Category");

class ProductController {
  async showAll(req, res) {
    let products = await Product.findAll({
      include: [{ model: Category }],
    });
    res.json(products);
  }

  async create(req, res) {
    try {
      let name = req.body.name;
      let measure = req.body.measure;
      let location = req.body.location;
      let category = req.body.category;
      let idExist = await Category.findByPk(category);

      if (idExist == undefined) {
        res.send("Id da categoria não existe");
      } else {
        await Product.create({
          name,
          measure,
          location,
          categoryId: category,
        });
        res.status(200);
        res.send("Produto cadastrado");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async edit(req, res) {
    let id = req.params.id;
    const { name, measure, location, category } = req.body;
    let idExist = await Category.findByPk(category);

    if (idExist == undefined) {
      res.status(406);
      res.send("Id da categoria não existe");
    } else {
      await Product.update(
        {
          name: name,
          measure: measure,
          location: location,
          categoryId: category,
        },
        { where: { id: id } }
      );
      res.status(200);
      res.send("Deu bom a edição");
    }
  }

  async remove(req, res) {
    let id = req.params.id;
    await Product.destroy({ where: { id: id } });
    try {
      res.status(200);
      res.send("Produto deletado");
    } catch (error) {
      res.status(406);
      res.send(error);
    }
  }
}

module.exports = new ProductController();
