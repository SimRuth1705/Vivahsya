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

// --- 🌟 ROBUST CORS CONFIGURATION 🌟 ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "https://vivahsya.vercel.app", // Your actual Vercel link
  "https://vivahsya-git-main-samson-rajs-projects.vercel.app" // Vercel Preview URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS Policy: This origin is not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🌟 IMPORTANT: Handle OPTIONS requests explicitly for Render/Vercel
app.options(/.*/, cors());

// --- MIDDLEWARE ---
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Request Logger (Helps debug cloud logs)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// --- DATABASE & SEEDING ---
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

app.get("/api/health", (req, res) => res.json({ status: "ok", message: "Server is alive" }));

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Whitelisted Origins: ${allowedOrigins.join(", ")}`);
});