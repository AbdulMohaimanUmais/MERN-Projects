require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  { name: 'Running Shoes', description: 'Lightweight breathable running shoes', price: 59.99, category: 'footwear', stock: 25 },
  { name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones', price: 89.99, category: 'electronics', stock: 15 },
  { name: 'Leather Backpack', description: 'Durable everyday leather backpack', price: 74.5, category: 'bags', stock: 10 },
  { name: 'Smart Watch', description: 'Fitness tracking smart watch', price: 129.99, category: 'electronics', stock: 20 },
  { name: 'Cotton T-Shirt', description: 'Soft premium cotton t-shirt', price: 19.99, category: 'clothing', stock: 50 },
  { name: 'Sunglasses', description: 'UV protection polarized sunglasses', price: 24.99, category: 'accessories', stock: 30 },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.insertMany(products);
  console.log('Seeded');
  process.exit();
};

run();