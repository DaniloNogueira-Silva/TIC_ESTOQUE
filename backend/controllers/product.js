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

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (product == undefined) {
        return res
          .status(404)
          .json({ message: "Id do produto não encontrado" });
      }

      res.status(200).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar o produto" });
    }
  }

  async edit(req, res) {
    try {
      const { id, name, measure, location, category, quantity } = req.body;
      const idExist = await Category.findByPk(category);
  
      if (!idExist) {
        res.status(406).send("O ID da categoria não existe");
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
        res.status(200).send("Produto editado com sucesso");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao editar o produto");
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
