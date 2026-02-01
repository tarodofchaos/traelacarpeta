const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/collection', require('./routes/collectionRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'MTG Card Trader API is running' });
});

module.exports = app;
