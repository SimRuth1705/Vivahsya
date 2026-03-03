const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/authMiddleware');




// Get all bookings with deep population
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('clientId', 'name email phone') 
      .populate('venueId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Atlas Fetch Failed", error: err.message });
  }
});

// Get user specific wedding details
router.get('/my-booking', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ leadId: req.user.leadId })
      .populate('venueId');
    if (!booking) return res.status(404).json({ message: "No active wedding found." });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;