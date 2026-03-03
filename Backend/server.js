const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

// 1. Load Env & Models
dotenv.config();
const User = require("./models/User");

// 2. Import Route Files
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const leadRoutes = require("./routes/leads");
const vendorRoutes = require("./routes/vendors");
const venueRoutes = require("./routes/venues");
const crmRoutes = require("./routes/crm");
const clientRoutes = require("./routes/clients");

const app = express();

// --- 3. MIDDLEWARE ---
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 4. HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Vivahasya API is LIVE!" });
});

// --- 5. MOUNT API ROUTES ---
// IMPORTANT: This prefix is added to EVERY route in auth.js
app.use("/api/auth", authRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/clients", clientRoutes);

// --- 6. ADMIN SEEDING LOGIC ---
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
        status: "Active",
      });
      console.log("🚀 Admin account seeded: admin@vivahasya.com / admin123");
    }
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  }
};

// --- 7. DATABASE & SERVER START ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected to Atlas");
    seedAdmin();
  })
  .catch((err) => console.log("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
