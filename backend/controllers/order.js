const { OrderItem, Order } = require("../models/Order");
const Product = require("../models/Product");

class OrderController {
  async create(req, res) {
    try {
      const { status, expected_date, items } = req.body;

      // Cria o pedido
      const order = await Order.create({ status, expected_date });

      // Adiciona os itens ao pedido
      const orderItems = await Promise.all(
        items.map(async ({ productId, quantity }) => {
          const product = await Product.findByPk(productId);
          if (!product) {
            throw new Error(`Produto com ID ${productId} não encontrado`);
          }
          return await OrderItem.create({
            orderId: order.id,
            productId,
            quantity,
          });
        })
      );

      // Retorna o pedido com os itens
      const response = {
        id: order.id,
        status: order.status,
        expected_date: order.expected_date,
        items: orderItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      res.status(201).json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao criar o pedido" });
    }
  }

  async showAll(req, res) {
    try {
      await Order.findAll({
        include: [{ model: OrderItem }],
      });

      res.status(200).json(Order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar os pedidos" });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const ordemItem = await OrderItem.findAll({ where: { orderId: id } });

      if (!ordemItem) {
        return res
          .status(404)
          .json({ message: "Item de pedido não encontrado" });
      }

      res.status(200).json(ordemItem);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar o item de pedido" });
    }
  }

  async remove(req, res) {
    try {
      let id = req.params.id;
      await Order.destroy({ where: { id: id } });
      res.status(200);
      res.send("Pedido deletado");
    } catch (error) {
      console.error(error);
      res.status(406).send({ message: "Erro ao deletar o pedido" });
    }
  }
}

module.exports = new OrderController();
