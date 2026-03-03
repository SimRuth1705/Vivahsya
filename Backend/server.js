const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const leadRoutes = require("./routes/leads");
const vendorRoutes = require("./routes/vendors");
const crmRoutes = require("./routes/crm");

dotenv.config();
const app = express();

// --- 1. MIDDLEWARE (MUST BE FIRST) ---
// configure CORS to echo the requesting origin and allow auth header
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
); // Allows the frontend to connect
app.use(express.json()); // Allows reading JSON data from CRM

// Import Middleware
const { adminOnly } = require("./middleware/authMiddleware");

// --- 2. ROUTES ---
// Public & Employee Access
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes); // Includes the new timeline route
app.use("/api/vendors", vendorRoutes);
app.use("/api/crm", crmRoutes);

// Owner Only Access
app.use("/api/leads", adminOnly, leadRoutes);
app.use("/api/sales", adminOnly, require("./routes/sales"));

// --- 3. DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
