const { OrderItem, Order } = require("../models/Order");
const Product = require("../models/Product");

class OrderController {
  async updateQuantProd(req, res) {
    try {
      const { orderId, productId } = req.body;
  
      const orderItem = await OrderItem.findByPk(orderId);
      if (!orderItem) {
        throw new Error(`Item de pedido com ID ${orderId} não encontrado`);
      }
  
      const newQuantity = orderItem.newQuantity;
  
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error(`Produto com ID ${productId} não encontrado`);
      }
  
      const updatedQuantity = product.quantity + newQuantity;
      await Product.update(
        { quantity: updatedQuantity },
        { where: { id: productId } }
      );
  
      res.status(201).send("Quantidade atualizada com sucesso.");
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }
  
  
  

  async create(req, res) {
    try {
      const { status, expected_date, items } = req.body;

      // Cria o pedido
      const order = await Order.create({ status, expected_date });

      if (!order) {
        throw new Error(`Não foi possível criar o pedido`);
      }

      // Adiciona os itens ao pedido
      const orderItems = await Promise.all(
        items.map(async ({ productId, quantityInStock, newQuantity }) => {
          const product = await Product.findByPk(productId);
          if (!product) {
            throw new Error(`Produto com ID ${productId} não encontrado`);
          }
          await OrderItem.create({
            orderId: order.id,
            productId,
            quantityInStock,
            newQuantity,
          });

          await Product.update(
            {
              quantity: quantityInStock,
            },
            {
              where: {
                id: productId,
              },
            }
          );
        })
      );

      // Retorna o pedido com os itens

      res.status(201).json();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao criar o pedido" });
    }
  }

  async showAll(req, res) {
    try {
      const orders = await Order.findAll({
        include: [{ model: OrderItem }],
      });

      res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar os pedidos" });
    }
  }

  async latest(req, res) {
    try {
      const orders = await Order.findAll({
        include: [{ model: OrderItem }],
        order: [['createdAt', 'DESC']],
        limit: 10
      });
  
      res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar os pedidos" });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const orderItems = await OrderItem.findAll({ where: { orderId: id } });

      if (!orderItems || orderItems.length === 0) {
        return res
          .status(404)
          .json({ message: "Item de pedido não encontrado" });
      }

      res.status(200).json(orderItems);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar o item de pedido" });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      await Order.destroy({ where: { id: id } });
      res.status(200).json({ message: "Pedido deletado" });
    } catch (error) {
      console.error(error);
      res.status(406).json({ message: "Erro ao deletar o pedido" });
    }
  }
}

module.exports = new OrderController();
