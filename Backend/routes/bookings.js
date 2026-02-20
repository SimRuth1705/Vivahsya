const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// 1. GET ALL BOOKINGS
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, startTime: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE NEW BOOKING (WITH CONFLICT CHECK)
router.post('/', async (req, res) => {
  const { date, startTime, endTime } = req.body;

  try {
    const conflict = await Booking.findOne({
      date: date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } }, 
        { endTime: { $gt: startTime, $lte: endTime } },  
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } } 
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: `Time slot conflict! already booked for ${conflict.title}` });
    }

    const booking = new Booking(req.body);
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. UPDATE BOOKING (WITH CONFLICT CHECK)
router.put('/:id', async (req, res) => {
  const { date, startTime, endTime } = req.body;

  try {
    const conflict = await Booking.findOne({
      _id: { $ne: req.params.id },
      date: date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: "This new time slot conflicts with another event." });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. DELETE BOOKING
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;