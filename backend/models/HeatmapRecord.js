const mongoose = require("mongoose");

const heatmapSchema = new mongoose.Schema({
  page: String,
  clicks: [{ x: Number, y: Number, t: Number }],
  sessionId: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HeatmapRecord", heatmapSchema);