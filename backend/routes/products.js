const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// GET — Listar com filtros
router.get("/", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, brand, condition } = req.query;
    const query = { active: true };

    if (category) query.category = category;
    if (brand) query.brand = new RegExp(brand, "i");
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).limit(100);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — Criar (Admin)
router.post("/", auth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE — Eliminar (Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: "Produto desactivado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;