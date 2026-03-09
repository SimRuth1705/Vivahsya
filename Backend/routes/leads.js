const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// 1. Get all leads (🔒 Owner Only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Add a new lead (🔓 Public)
router.post("/", async (req, res) => {
  const lead = new Lead(req.body);
  try {
    const newLead = await lead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const User = require("../models/User");
const Booking = require("../models/Booking");
const bcrypt = require("bcryptjs");

// 3. Update lead status or info (🔒 Owner/Admin Only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // AUTO-CREATE BOOKING IF STATUS TURNED TO CONFIRM MANUALLY
    // Without this, the CRM timeline page gets a 404 since no booking exists!
    if (updatedLead.status === "Confirm" || updatedLead.status === "Confirmed") {
      const existingBooking = await Booking.findOne({ leadId: updatedLead._id });
      if (!existingBooking) {
        // 1. Create client User account payload
        const rawPassword = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        let user = await User.findOne({ username: updatedLead.email });
        if (!user && updatedLead.email) {
          user = await User.create({
            name: updatedLead.name,
            username: updatedLead.email, // using email as login
            password: hashedPassword,
            role: "client",
            status: "Active",
            leadId: updatedLead._id
          });
        }

        // 2. Formally generate the Booking so timeline fetch won't 404
        await Booking.create({
          title: `${updatedLead.name}'s Event`,
          leadId: updatedLead._id,
          clientId: user ? user._id : undefined,
          date: updatedLead.date,
          status: "Confirmed",
          amount: updatedLead.budget || "0",
          type: updatedLead.eventType || "Wedding"
        });

        console.log(`✅ Auto-created Booking for Lead: ${updatedLead.name} safely.`);
      }
    }

    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Delete a lead (🔒 Owner/Admin Only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
