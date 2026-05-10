const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/itinerary', require('./routes/itinerary'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/packing', require('./routes/packing'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/share', require('./routes/sharing'));
app.use('/api/users', require('./routes/users'));

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Traveloop API', version: '1.0.0' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🌍 Traveloop API running on http://localhost:${PORT}`);
});
