require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { webhook } = require('./src/controllers/subscriptionController');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.post('/api/subscription/webhook', express.raw({ type: 'application/json' }), webhook);

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/subscription', require('./src/routes/subscriptionRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));