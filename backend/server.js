require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

// Segurança
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.includes("localhost") || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use("/api/news", require("./routes/news"));

// Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

const orderLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 });
app.use("/api/orders", orderLimiter);

// Rotas
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/tickets", require("./routes/tickets"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/pixel", require("./routes/pixel"));
app.use("/api/abtests",  require("./routes/abtests"));
app.use("/api/heatmap", require("./routes/heatmap"));
app.use("/api/auth", require("./routes/auth"));

// Health Check
app.get("/", (req, res) => res.json({ status: "OSOTEC API Online", version: "1.0.0" }));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Conectar MongoDB e Iniciar
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB conectado");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Servidor a correr na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erro MongoDB:", err.message);
    process.exit(1);
  });