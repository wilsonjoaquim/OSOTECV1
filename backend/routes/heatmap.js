const router = require("express").Router();
const HeatmapRecord = require("../models/HeatmapRecord");

router.post("/record", async (req, res) => {
  try {
    const record = new HeatmapRecord(req.body);
    await record.save();
    res.json({ ok: true });
  } catch {
    res.json({ ok: false });
  }
});

router.get("/data", async (req, res) => {
  try {
    const { page } = req.query;
    const records = await HeatmapRecord.find({ page }).limit(500);
    const allClicks = records.flatMap(r => r.clicks || []);

    const grouped = {};
    allClicks.forEach(({ x, y }) => {
      const key = `${Math.round(x / 5) * 5}_${Math.round(y / 5) * 5}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const clicks = Object.entries(grouped).map(([key, count]) => {
      const [x, y] = key.split("_").map(Number);
      return { x, y, count };
    });

    res.json({ page, clicks, total: allClicks.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;