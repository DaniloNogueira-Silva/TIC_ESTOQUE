const BuyList = require("../models/BuyList")
const { Op } = require('sequelize')

class BuyListController {
    async index(req, res) {
        let buyList = await BuyList.findAll()
        res.status(200).send(buyList)
    }

    async create(req, res) {  
       try {
        let name = req.body.name;
            await BuyList.create({
                name
            })
            res.status(200).send("Produto cadastrado");
       } catch (error) {
            res.status(400).send(error);
       }
    }

    async showBuyList(req, res) {
        console.log(req.body)
    
        // check if user is searching
        let search = ''
    
        if (req.body.search) {
          search = req.body.search
        }

        let order = req.body.order

        if (order === true) {
        order = 'ASC'
        } else {
        order = 'DESC'
        }
    
        await BuyList.findAll({
          where: {
            name: { [Op.like]: `%${search}%`}
          },
          order: [['name', order]],
        })
          .then((data) => {
            let buyListSearch = data.length
    
            if (buyListSearch === 0) {
              buyListSearch = false
            }
    
            const buyList = data.map((result) => result.get({ plain: true }))
    
            res.send({ buyList, buyListSearch, search })
          })
          .catch((err) => console.log(err))
      }
      
}

module.exports = new BuyListController()