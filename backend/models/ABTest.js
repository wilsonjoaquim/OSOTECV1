const mongoose = require("mongoose");

const abTestSchema = new mongoose.Schema({
  slug:       { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  hypothesis: { type: String, required: true },
  status:     { type: String, enum: ["running", "completed", "paused"], default: "running" },
  variants: [{
    id:          String,
    name:        String,
    description: String,
    views:       { type: Number, default: 0 },
    clicks:      { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
  }],
  startDate: { type: Date, default: Date.now },
  endDate:   Date,
}, { timestamps: true });

module.exports = mongoose.model("ABTest", abTestSchema);