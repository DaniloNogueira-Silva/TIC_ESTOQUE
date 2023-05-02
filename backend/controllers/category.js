const Category = require("../models/Category")

class CategoryController {

    async showAll(req, res) {
        let categories = await Category.findAll()
        res.status(200).send(categories)
    }

    async create(req, res) {
        try {
            let name = req.body.name;

            await Category.create({
                name
            });
            res.status(200);
            res.send("Categoria cadastrada");
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async remove(req, res) {
        let id = req.params.id
        await Category.destroy({ where: { id: id } })
        try {
            res.status(200)
            res.send("Usuário deletado")
        } catch (error) {
            res.status(406)
            res.send(error)
        }
    }
}

module.exports = new CategoryController()