const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const leadRoutes = require('./routes/leads');
const vendorRoutes = require('./routes/vendors');
const crmRoutes = require('./routes/crm');
dotenv.config();

const app = express();

// backend/server.js
const { adminOnly } = require('./middleware/authMiddleware');

// Public/Employee Routes
app.use('/api/auth', authRoutes); 
app.use('/api/bookings', bookingRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/crm', crmRoutes);

// OWNER ONLY ROUTES (Financial & Team Management)
app.use('/api/leads', adminOnly, leadRoutes); // Protects the lead budgets
app.use('/api/sales', adminOnly, require('./routes/sales')); 
// Note: We apply adminOnly to auth/users inside the auth route or here

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/crm', crmRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));