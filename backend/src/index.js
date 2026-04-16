const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Veritabanı bağlantısı
connectDB();

// Rotalar (Routes)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Test Endpoint'i
app.get('/', (req, res) => {
    res.json({ message: 'APAYS Backend API Çalışıyor!' });
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} portunda başlatıldı.`);
});
