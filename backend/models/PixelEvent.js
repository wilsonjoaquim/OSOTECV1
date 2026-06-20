const mongoose = require("mongoose");

const pixelEventSchema = new mongoose.Schema({
  event: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  url: String,
  referrer: String,
  userAgent: String,
  screen: String,
  sessionId: String,
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("PixelEvent", pixelEventSchema);