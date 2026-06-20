const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, lowercase: true },
  brand: { type: String, default: "Sem marca" },
  condition: { type: String, enum: ["novo", "recondicionado"], default: "novo" },
  stock: { type: Number, default: 0, min: 0 },
  image: { type: String, default: "" },
  active: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ name: "text", brand: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);