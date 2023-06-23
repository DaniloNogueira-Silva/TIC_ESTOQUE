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
      const { name, location, quantity, purchase_allowed, originCityHall, category, measure } = req.body;
      
      const idCategoryExist = await Category.findByPk(category);
      const idMeasureExist = await Measure.findByPk(measure);

      if (idCategoryExist == undefined && idMeasureExist == undefined) {
        res.send("Id da categoria ou id da quantidade não existe");
      } else {
        await Product.create({
          name,
          location,
          quantity,
          purchase_allowed,
          originCityHall,
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
      const id = req.params.id
      const { name, location, quantity, purchase_allowed, originCityHall, category, measure } = req.body;
  
      const idCategoryExist = await Category.findByPk(category);
      const idMeasureExist = await Measure.findByPk(measure);

      if (idCategoryExist == undefined && idMeasureExist == undefined) {
        res.send("Id da categoria ou id da quantidade não existe");
      } else {
        await Product.update(
          {
            name,
            location,
            quantity,
            purchase_allowed,
            originCityHall,
            categoryId: category,
            measureId: measure,
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
    try {
      const { id } = req.body;
      await Product.destroy({ where: { id: id } });
      res.status(200).send("Produto deletado");
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new ProductController();
