const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs"); // ✅ Added Missing Import

// Load Environment Variables
dotenv.config();

// --- MODEL & ROUTE IMPORTS ---
const User = require("./models/User"); // ✅ Added Missing Import
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const leadRoutes = require("./routes/leads");
const vendorRoutes = require("./routes/vendors");
const crmRoutes = require("./routes/crm");
const venueRoutes = require("./routes/venues");
const portfolioRoutes = require("./routes/portfolio");

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:5175", 
    "http://localhost:3000",
    "http://127.0.0.1:5173" 
  ],
  credentials: true
}));

// ✅ Support high-resolution image uploads
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Static folder for local uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- SEEDING LOGIC ---
// Updated to use 'username' for the new auth system
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: "admin" }); 
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Vivahasya Admin",
        username: "admin", 
        password: hashedPassword,
        role: "owner",
        status: "Active"
      });
      console.log("🚀 Admin account seeded: username: admin / pass: admin123");
    }
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  }
};

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    seedAdmin(); // ✅ MUST CALL HERE to ensure DB is ready before seeding
  })
  .catch(err => console.error("❌ DB Connection Error:", err));

// --- ROUTE MOUNTING ---
app.use("/api/auth", authRoutes); 
app.use("/api/bookings", bookingRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Health Check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));