const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const timelineEventSchema = new mongoose.Schema({
  action: String,
  note: String,
  date: { type: Date, default: Date.now },
  by: String,
});

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, default: () => "TKT-" + nanoid(6).toUpperCase(), unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: String,
  orderId: String,
  category: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "in_progress", "resolved", "closed"],
    default: "open",
  },
  timeline: [timelineEventSchema],
  assignedTo: String,
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);