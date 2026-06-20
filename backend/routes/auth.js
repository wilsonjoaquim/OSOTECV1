const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Definir o User directamente aqui para descartar problemas de import
const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  phone:        { type: String, default: "" },
  password:     { type: String, required: true },
  province:     { type: String, default: "" },
  municipality: { type: String, default: "" },
  zone:         { type: String, default: "" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Este email já está registado" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, phone: phone || "", password: hashed });

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Email ou senha incorrectos" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Email ou senha incorrectos" });

    const token = signToken(user._id);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Não autorizado" });
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    const Order = mongoose.model("Order");
    const orders = await Order.find({ "customer.userId": user._id }).sort({ createdAt: -1 }).limit(20);
    res.json({ user, orders });
  } catch (err) {
    console.error("ME ERROR:", err.message);
    res.status(401).json({ error: "Token inválido" });
  }
});

// PUT /api/auth/me
router.put("/me", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Não autorizado" });
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const { name, phone, province, municipality, zone } = req.body;
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name, phone, province, municipality, zone },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
});

module.exports = router;