const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');
const aiRoutes = require('./src/routes/ai.routes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Aura AI Backend is running on Render.' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Aura AI API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
