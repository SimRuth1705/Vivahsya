const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// --- 1. LOGIN (Username Based) ---
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find by username
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

// --- 2. GET ALL USERS ---
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- 3. REGISTER (Fixed 500 Error Logic) ---
router.post("/register", protect, adminOnly, async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    // Check if username is taken
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Explicitly create user without email field
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
    res.status(500).json({ message: err.message }); // This sends the exact DB error to the frontend
  }
});

// --- 4. STATUS & DELETE ---
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