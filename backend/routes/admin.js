const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Order = require("../models/Order");
const Ticket = require("../models/Ticket");
const Product = require("../models/Product");
const PixelEvent = require("../models/PixelEvent");
const auth = require("../middleware/auth");
const { sendMail, templates } = require("../utils/mailer");

// POST — Login Admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

// GET — Stats do Dashboard
router.get("/stats", auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalRevenue, totalOrders, openTickets, todayVisits] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.countDocuments(),
      Ticket.countDocuments({ status: "open" }),
      PixelEvent.countDocuments({ event: "page_view", timestamp: { $gte: today } }),
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      openTickets,
      todayVisits,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Listar Encomendas
router.get("/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — Actualizar Estado da Encomenda
router.put("/orders/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const update = {
      deliveryStatus: status,
      status,
      [`timeline.${status}`]: new Date(),
    };
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ error: "Não encontrado" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Listar Tickets
router.get("/tickets", auth, async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 }).limit(100);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — Actualizar Estado do Ticket
router.put("/tickets/:id/status", auth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Não encontrado" });

    ticket.status = status;
    ticket.timeline.push({ action: `Estado alterado para: ${status}`, note, date: new Date(), by: "Admin" });
    await ticket.save();

    await sendMail(templates.ticketUpdate(ticket, status));
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Analytics
router.get("/analytics", auth, async (req, res) => {
  try {
    const [totalVisits, addToCart, checkouts, ratings, pageEventsRaw] = await Promise.all([
      PixelEvent.countDocuments({ event: "page_view" }),
      PixelEvent.countDocuments({ event: "add_to_cart" }),
      PixelEvent.countDocuments({ event: "checkout_start" }),
      Order.aggregate([
        { $match: { rating: { $exists: true, $ne: null } } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]),
      PixelEvent.aggregate([
        { $match: { event: "page_view" } },
        { $group: { _id: "$data.page", count: { $sum: 1 } } },
        { $project: { page: "$_id", count: 1, _id: 0 } },
      ]),
    ]);

    const avgRating = ratings[0]?.avg ? ratings[0].avg.toFixed(1) : null;
    const conversionRate = totalVisits > 0 ? ((checkouts / totalVisits) * 100).toFixed(1) : 0;

    res.json({
      totalVisits,
      addToCart,
      checkouts,
      conversionRate,
      avgRating,
      pageEvents: pageEventsRaw,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Avaliações
router.get("/ratings", auth, async (req, res) => {
  try {
    const ratings = await Order.find(
      { rating: { $exists: true, $ne: null } },
      { rating: 1, ratingComment: 1, ratedAt: 1, orderId: 1 }
    ).sort({ ratedAt: -1 }).limit(50);
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;