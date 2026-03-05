const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

dotenv.config();

// --- MODEL & ROUTE IMPORTS ---
const User = require("./models/User");
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
  origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"],
  credentials: true
}));

app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ NEW: Request Logger (Helps find 404s)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// --- SEEDING ---
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
      console.log("🚀 Admin account seeded");
    }
  } catch (err) { console.error("❌ Seeding error:", err.message); }
};

// --- DATABASE ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    seedAdmin();
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

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));