const { OrderItem, Order } = require("../models/Order");
const Product = require("../models/Product");

class OrderController {
  async create(req, res) {
    try {
      const { status, items } = req.body;

      // Cria o pedido
      const order = await Order.create({ status });

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
      const orders = await OrderItem.findAll({
      });
      res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar os pedidos" });
    }
  }

  async remove(req, res) {
    let id = req.params.id
    await Order.destroy({ where: { id: id } })
    try {
        res.status(200)
        res.send("Pedido deletado")
    } catch (error) {
        res.status(406)
        res.send(error)
    }
}
}

module.exports = new OrderController();
