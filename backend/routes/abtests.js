const router = require("express").Router();
const ABTest = require("../models/ABTest");
const auth = require("../middleware/auth");

// Listar testes (admin)
router.get("/", auth, async (req, res) => {
  try {
    const tests = await ABTest.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Criar teste (admin)
router.post("/", auth, async (req, res) => {
  try {
    const test = await ABTest.create(req.body);
    res.status(201).json(test);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Registar evento numa variante (público — chamado pelo frontend)
router.post("/:slug/event", async (req, res) => {
  try {
    const { variantId, event } = req.body; // event: "view" | "click" | "conversion"
    const field = event === "view" ? "variants.$.views"
                : event === "click" ? "variants.$.clicks"
                : "variants.$.conversions";

    const result = await ABTest.updateOne(
      { slug: req.params.slug, "variants.id": variantId },
      { $inc: { [field]: 1 } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Teste ou variante não encontrada" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("AB EVENT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar estado (admin)
router.put("/:id", auth, async (req, res) => {
  try {
    const test = await ABTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(test);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;