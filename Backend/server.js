const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

// 1. Load Configurations
dotenv.config();

// 2. Import Sub-Routers
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const leadRoutes = require("./routes/leads");
const vendorRoutes = require("./routes/vendors");
const crmRoutes = require("./routes/crm");
const venueRoutes = require("./routes/venues");

// Import Model for Seeding
const User = require("./models/User");

const app = express();

// --- 3. MIDDLEWARE ---
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 4. CLOUD DATABASE CONNECTION (Atlas) ---
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@vivahasya.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Vivahasya Admin",
        email: "admin@vivahasya.com",
        password: hashedPassword,
        role: "owner",
        status: "Active"
      });
      console.log("🚀 Admin account seeded: admin@vivahasya.com / admin123");
    }
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected Successfully");
    seedAdmin(); // Run seed after connection
  })
  .catch(err => console.error("❌ MongoDB Atlas Connection Error:", err));

// --- 5. ROUTES MOUNTING ---
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/crm", crmRoutes);

// --- 6. HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Vivahasya API is active and connected to Atlas!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));