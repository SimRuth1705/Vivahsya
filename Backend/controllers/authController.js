const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // 🌟 Added
const { protect, adminOnly } = require('../middleware/authMiddleware');

// --- 🌟 NODEMAILER CONFIGURATION 🌟 ---
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS — required for Render (IPv4 compatible)
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// --- 1. LOGIN (Username Based) ---
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, role: user.role, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 🌟 2. NEW: REGISTER INITIATE (Send OTP/Mail) ---
// This handles the first step of your RegisterPage.jsx
router.post("/register-initiate", async (req, res) => {
  try {
    const { email, name } = req.body;

    // 1. Generate a simple 6-digit code
    const otp = Math.floor(100000 + Math.random() * 900000);

    console.log(`🛠️ Attempting to send OTP to ${email} via Render...`);

    // 2. Send the mail
    await transporter.sendMail({
      from: `"Vivahasya" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Access Key - Vivahasya",
      html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #FF7F11;">Security Protocol</h2>
          <p>Hello ${name || 'User'},</p>
          <p>Your one-time access key to join the Vivahasya team is:</p>
          <h1 style="letter-spacing: 5px; color: #FF7F11; text-align: center;">${otp}</h1>
          <p style="font-size: 10px; color: #555;">This code will expire shortly.</p>
        </div>
      `
    });

    // 3. In a real app, you'd save this OTP to DB/Redis. 
    // For now, we return success so the frontend moves to Step 2.
    res.status(200).json({ message: "Security code sent to email" });
  } catch (err) {
    console.error("❌ Mailer Error:", err);
    res.status(500).json({ message: "Mail system offline. Check Render Env variables." });
  }
});

// --- 3. GET ALL USERS ---
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- 4. FINAL REGISTER (After OTP is verified) ---
router.post("/register", protect, adminOnly, async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: "Team member registered" });
  } catch (err) {
    console.error("Auth Register Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// --- 5. STATUS & DELETE ---
router.put("/users/status/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = user.status === "Active" ? "Inactive" : "Active";
    await user.save();
    res.json({ message: "Status updated" });
  } catch (err) { res.status(500).json({ message: "Update failed" }); }
});

router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.role === 'owner') return res.status(403).json({ message: "Cannot delete owner" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) { res.status(500).json({ message: "Delete failed" }); }
});

module.exports = router;