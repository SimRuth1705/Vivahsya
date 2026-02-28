const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import the middleware we created
const { protectOwner } = require('../middleware/roleMiddleware');

// --- 1. LOGIN ROUTE (Public) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. REGISTER TEAM MEMBER (🔒 Owner Only) ---
router.post('/register', protectOwner, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'employee',
      status: 'Active'
    });

    const savedUser = await newUser.save();
    
    // Convert to object and remove password before sending
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 3. GET ALL USERS (🔒 Owner Only) ---
router.get('/users', protectOwner, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 4. DELETE USER (🔒 Owner Only) ---
router.delete('/users/:id', protectOwner, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 5. TOGGLE USER STATUS (🔒 Owner Only) ---
router.put('/users/status/:id', protectOwner, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    await user.save();
    
    res.status(200).json({ 
      message: `User is now ${user.status}`, 
      status: user.status 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;