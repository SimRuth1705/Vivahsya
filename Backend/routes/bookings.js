const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// ✅ FIX: Ensure this line looks exactly like this
const { protect, adminOnly } = require('../middleware/authMiddleware');

// --- 1. GET ALL BOOKINGS (For Admin Dashboard) ---
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('clientId', 'name email phone') 
      .populate('leadId', 'date budget')
      .populate('venueId') // 👈 Added: Shows venue details to Admin
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch bookings", error: err.message });
  }
});

// --- 2. GET LOGGED-IN CLIENT'S BOOKING (For book.jsx) ---
router.get('/my-booking', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ leadId: req.user.leadId })
      .populate('clientId') 
      .populate('leadId')
      .populate('venueId'); // 👈 Added: Sends Venue Name & Image URL to book.jsx

    if (!booking) {
      return res.status(404).json({ message: "No active booking found for your account." });
    }

    res.json(booking);
  } catch (err) {
    console.error("Fetch My-Booking Error:", err.message);
    res.status(500).json({ message: "Server error fetching your wedding details." });
  }
});

// --- 3. GET SINGLE BOOKING BY ID (For Admin Timeline Editor) ---
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('clientId')
      .populate('leadId')
      .populate('venueId'); // 👈 Added
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 4. UPDATE ONLY TIMELINE ---
router.put('/timeline/:id', protect, adminOnly, async (req, res) => {
  try {
    const { timeline } = req.body; 
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { timeline: timeline } },
      { new: true, runValidators: true }
    ).populate('clientId');

    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

// --- 5. ASSIGN VENUE TO BOOKING (New Helper) ---
// Use this when you select a venue for a client in the Admin CRM
router.patch('/assign-venue/:id', protect, adminOnly, async (req, res) => {
  try {
    const { venueId } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { venueId: venueId },
      { new: true }
    ).populate('venueId');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Venue assignment failed" });
  }
});

console.log("Checking Middleware...");
console.log("Protect is a:", typeof protect); // Should say 'function'
console.log("AdminOnly is a:", typeof adminOnly); // Should say 'function'

module.exports = router;