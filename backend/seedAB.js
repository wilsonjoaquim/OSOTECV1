require("dotenv").config();
const mongoose = require("mongoose");
const ABTest = require("./models/ABTest");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await ABTest.deleteMany({});
  await ABTest.insertMany([
    {
      slug: "hero_cta_001",
      name: "Botão Hero — CTA Principal",
      hypothesis: "Um CTA mais urgente gera mais cliques do que o genérico",
      status: "running",
      variants: [
        { id: "A", name: "Controlo", description: "Ver Produtos →", views: 0, clicks: 0, conversions: 0 },
        { id: "B", name: "Variante", description: "Comprar Agora — Oferta", views: 0, clicks: 0, conversions: 0 },
      ],
    },
    {
      slug: "product_btn_001",
      name: "Botão Adicionar ao Carrinho",
      hypothesis: "Texto mais descritivo aumenta a taxa de adição ao carrinho",
      status: "running",
      variants: [
        { id: "A", name: "Controlo", description: "Adicionar", views: 0, clicks: 0, conversions: 0 },
        { id: "B", name: "Variante", description: "Adicionar ao Cesto", views: 0, clicks: 0, conversions: 0 },
      ],
    },
  ]);
  console.log("✅ Testes A/B criados!");
  process.exit(0);
}).catch((err) => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});