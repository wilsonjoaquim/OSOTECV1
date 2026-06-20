const router = require("express").Router();
const PixelEvent = require("../models/PixelEvent");

router.post("/track", async (req, res) => {
  try {
    const event = new PixelEvent(req.body);
    await event.save();
    res.json({ ok: true });
  } catch {
    res.json({ ok: false });
  }
});

module.exports = router;