require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('DormStay Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
