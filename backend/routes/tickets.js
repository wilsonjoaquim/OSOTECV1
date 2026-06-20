const router = require("express").Router();
const Ticket = require("../models/Ticket");
const { sendMail, templates } = require("../utils/mailer");

// POST — Criar Ticket
router.post("/", async (req, res) => {
  try {
    const ticket = new Ticket({
      ...req.body,
      timeline: [{ action: "Ticket criado", date: new Date() }],
    });
    await ticket.save();
    await sendMail(templates.newTicket(ticket));
    res.status(201).json({ ticketId: ticket.ticketId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Ver Ticket por ID
router.get("/:ticketId", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId.toUpperCase() });
    if (!ticket) return res.status(404).json({ error: "Ticket não encontrado" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;