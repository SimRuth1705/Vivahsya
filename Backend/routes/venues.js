const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Venue = require('../models/Venue');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 1. Configure how images are stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure you create an 'uploads' folder in your backend root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Saves as 17123456.jpg
  }
});

const upload = multer({ storage: storage });

// --- 2. CREATE VENUE (Admin Only) ---
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, location, capacity, description, price } = req.body;
    
    const newVenue = new Venue({
      name,
      location,
      capacity,
      description,
      price,
      imageUrl: `/uploads/${req.file.filename}` // Saves the path to MongoDB
    });

    await newVenue.save();
    res.status(201).json(newVenue);
  } catch (err) {
    res.status(400).json({ message: "Upload failed", error: err.message });
  }
});

// --- 3. GET ALL VENUES ---
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;