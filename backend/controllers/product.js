const Product = require("../models/Product");
const Category = require("../models/Category");
const Measure = require("../models/Measure");

class ProductController {
  async showAll(req, res) {
    let products = await Product.findAll({
      include: [{ model: Category }, { model: Measure }],
    });
    res.json(products);
  }

  async create(req, res) {
    try {
      const { name, measure, location, category, quantity } = req.body;

      let idExist = await Category.findByPk(category);
      let idExistMeasure = await Measure.findByPk(measure);

      if (idExist == undefined && idExistMeasure == undefined) {
        res.send("Id da categoria ou id da quantidade não existe");
      } else {
        await Product.create({
          name,
          measure,
          location,
          quantity,
          categoryId: category,
          measureId: measure,
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
    const { name, measure, location, category, quantity } = req.body;
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
          quantity: quantity,
          measureId: measure,
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
