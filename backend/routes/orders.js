const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendMail, templates } = require("../utils/mailer");

// POST — Criar Encomenda
router.post("/", async (req, res) => {
  try {
    const { items, customer, payment, total } = req.body;

    // Validar stock
    for (const item of items) {
      if (item.product) {
        const product = await Product.findById(item.product);
        if (product && product.stock < item.qty) {
          return res.status(400).json({ error: `Stock insuficiente para: ${item.name}` });
        }
      }
    }

    const order = new Order({ items, customer, payment, total });
    await order.save();

    // Decrementar stock
    for (const item of items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
      }
    }

    // Notificar admin por email
    await sendMail(templates.newOrder(order));

    res.status(201).json({ orderId: order.orderId, _id: order._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Rastrear Encomenda
router.get("/track/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() });
    if (!order) return res.status(404).json({ error: "Encomenda não encontrada" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — Avaliar Encomenda
router.post("/:orderId/rating", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { rating, ratingComment: comment, ratedAt: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Encomenda não encontrada" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;