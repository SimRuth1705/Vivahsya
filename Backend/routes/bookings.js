const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const User = require("../models/User");
const Lead = require("../models/Lead");

const bcrypt = require("bcryptjs");
const { Resend } = require("resend");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================================================
// 0️⃣ ADMIN: GET ALL BOOKINGS (Dashboard List)
// =====================================================
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("leadId", "name email status")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
});

// =====================================================
// 1️⃣ ADMIN: CONFIRM LEAD & CREATE ACCOUNT
// =====================================================
router.post("/confirm/:id", protect, adminOnly, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const rawPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = await User.create({
      name: lead.name,
      username: lead.email,
      password: hashedPassword,
      role: "client",
      leadId: lead._id
    });

    const booking = await Booking.create({
      title: `${lead.name}'s Event`,
      leadId: lead._id,
      clientId: user._id,
      date: lead.date,
      status: "Confirmed"
    });

    lead.status = "Confirm";
    await lead.save();

    await resend.emails.send({
      from: "Vivahasya <onboarding@resend.dev>",
      to: lead.email,
      subject: "Vivahasya Portal Active",
      html: `<h3>Welcome to Vivahasya!</h3>
             <p>Your wedding portal is active. Use the credentials below to log in:</p>
             <p><strong>Login:</strong> ${lead.email}</p>
             <p><strong>Password:</strong> ${rawPassword}</p>`
    });

    res.json({ message: "Sync Complete", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// 2️⃣ CLIENT: GET THEIR OWN BOOKING
// =====================================================
// Note: This must stay ABOVE the "/:id" route!
router.get("/my-booking", protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ leadId: req.user.leadId })
      .populate("venueId")
      .populate("leadId")
      .populate("clientId", "name username");

    if (!booking) {
      return res.status(404).json({ message: "No active wedding found." });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// 3️⃣ ADMIN: GET SPECIFIC BOOKING BY LEAD ID
// =====================================================
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findOne({ leadId: req.params.id });
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch booking." });
  }
});

// =====================================================
// 4️⃣ ADMIN: UPDATE BOOKING
// =====================================================
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// 5️⃣ ADMIN: UPDATE TIMELINE
// =====================================================
router.put('/timeline/:id', protect, adminOnly, async (req, res) => {
  try {
    const { timeline } = req.body;
    const updatedBooking = await Booking.findOneAndUpdate(
      { leadId: req.params.id },
      { $set: { timeline: timeline } },
      { new: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: "Booking not found." });
    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: "Failed to save timeline." });
  }
});

module.exports = router;