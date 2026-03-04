const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const User = require("../models/User");
const Lead = require("../models/Lead");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// =============================
// EMAIL CONFIG
// =============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_APP_PASSWORD,
  },
});

router.post("/confirm/:id", protect, adminOnly, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // 1. Create Credentials
    const rawPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 2. Create Client User
    const user = await User.create({
      name: lead.name,
      username: lead.email,
      password: hashedPassword,
      role: "client",
      leadId: lead._id
    });

    // 3. Create Booking (For Calendar/Booking Page)
    const booking = await Booking.create({
      title: `${lead.name}'s Event`,
      leadId: lead._id,
      clientId: user._id,
      date: lead.date,
      status: "Confirmed"
    });

    // 4. Update Lead & Send Email
    lead.status = "Confirm";
    await lead.save();

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: lead.email,
      subject: "Vivahasya Portal Active",
      html: `<p>Login: ${lead.email} | Pass: ${rawPassword}</p>`
    });

    res.json({ message: "Sync Complete", booking });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// =====================================================
// 3️⃣ CLIENT: GET THEIR OWN BOOKING
// =====================================================
router.get("/my-booking", protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      leadId: req.user.leadId,
    })
      .populate("venueId")
      .populate("leadId")
      .populate("clientId", "name username");

    if (!booking) {
      return res.status(404).json({
        message: "No active wedding found for this account.",
      });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// 4️⃣ GET SPECIFIC BOOKING BY LEAD ID
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
// 5️⃣ UPDATE BOOKING (ADMIN)
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
// 6️⃣ UPDATE TIMELINE (ADMIN)
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