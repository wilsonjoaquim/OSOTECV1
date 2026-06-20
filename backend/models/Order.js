const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  qty: { type: Number, min: 1 },
  price: Number,
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, default: () => "ORD-" + nanoid(8).toUpperCase(), unique: true },
  items: [orderItemSchema],
  customer: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    fullName: { type: String, required: true },
    nif: String,
    phone: { type: String, required: true },
    province: { type: String, required: true },
    municipality: String,
    zone: String,
  },
  payment: {
    method: { type: String, enum: ["multicaixa", "transferencia", "entrega"] },
    cardLast4: String,
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
    default: "confirmed",
  },
  deliveryStatus: {
    type: String,
    enum: ["confirmed", "processing", "shipped", "out_for_delivery", "delivered"],
    default: "confirmed",
  },
  timeline: {
    confirmed: { type: Date, default: Date.now },
    processing: Date,
    shipped: Date,
    out_for_delivery: Date,
    delivered: Date,
  },
  rating: { type: Number, min: 1, max: 5 },
  ratingComment: String,
  ratedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);