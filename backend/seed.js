require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  { name: "Laptop Dell Inspiron 15", price: 450000, category: "computadores", brand: "Dell", stock: 10, condition: "novo", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400", description: "Intel Core i5, 8GB RAM, 512GB SSD" },
  { name: "HP ProBook 440 G9", price: 520000, category: "computadores", brand: "HP", stock: 7, condition: "novo", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", description: "Core i7, 16GB RAM, 1TB SSD" },
  { name: "Samsung Galaxy A54", price: 195000, category: "phones", brand: "Samsung", stock: 20, condition: "novo", image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400", description: "6.4\", 128GB, 5000mAh" },
  { name: "iPhone 14 Pro", price: 750000, category: "phones", brand: "Apple", stock: 5, condition: "novo", image: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=400", description: "256GB, Câmera 48MP" },
  { name: "Teclado Logitech MX Keys", price: 45000, category: "acessorios", brand: "Logitech", stock: 15, condition: "novo", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400" },
  { name: "Monitor LG 24\" Full HD", price: 185000, category: "computadores", brand: "LG", stock: 8, condition: "novo", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400" },
  { name: "Router TP-Link Wi-Fi 6", price: 78000, category: "redes", brand: "TP-Link", stock: 12, condition: "novo", image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400" },
  { name: "AirPods Pro 2ª Geração", price: 210000, category: "acessorios", brand: "Apple", stock: 6, condition: "novo", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400" },
  { name: "Impressora HP LaserJet", price: 280000, category: "impressoras", brand: "HP", stock: 4, condition: "novo", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400" },
  { name: "Câmera Canon EOS R50", price: 420000, category: "cameras", brand: "Canon", stock: 3, condition: "novo", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400" },
  { name: "UPS APC 1000VA", price: 95000, category: "energia", brand: "APC", stock: 9, condition: "novo", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400" },
  { name: "SSD Kingston 1TB", price: 65000, category: "componentes", brand: "Kingston", stock: 25, condition: "novo", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400" },
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ ${products.length} produtos inseridos`);
    process.exit(0);
  })
  .catch((err) => { console.error(err); process.exit(1); });