const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const interactionRoutes = require('./src/routes/interactionRoutes');
const financeRoutes = require('./src/routes/financeRoutes');
const despostRoutes = require('./src/routes/despostRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const appointmentRoutes = require('./src/routes/appointment');
const contractRoutes = require('./src/routes/contractRoutes');
const handoverRoutes = require('./src/routes/handoverRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');


const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('DormStay Backend Running');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'dormstay-server' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/interaction', interactionRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/deposit', despostRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', appointmentRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/handover', handoverRoutes);
app.use('/api/payment', paymentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
