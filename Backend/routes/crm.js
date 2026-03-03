const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Lead = require("../models/Lead");
const Booking = require("../models/Booking");
const Client = require("../models/Client");
const User = require("../models/User");
const { adminOnly, protect } = require("../middleware/authMiddleware");

// Confirm Lead & Onboard Client
router.post("/confirm/:id", protect, adminOnly, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found." });

    // 1. Generate Credentials
    const cleanName = lead.name.replace(/\s/g, "").toLowerCase();
    const tempPassword = `${cleanName.slice(0, 4)}@26`;

    // 2. Create Client & Booking
    const newClient = await Client.create({
      name: lead.name,
      phone: lead.contact,
      email: lead.email,
      location: lead.location,
      totalSpent: lead.budget || 0,
    });

    await Booking.create({
      title: `${lead.name}'s Wedding`,
      clientId: newClient._id,
      leadId: lead._id,
      status: "Confirmed",
    });

    // 3. Create Login Account
    let user = await User.findOne({ email: lead.email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      user = await User.create({
        name: lead.name,
        email: lead.email,
        password: hashedPassword,
        role: "client",
        leadId: lead._id,
      });
    }

    // 4. Send Cloud Notification (Nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      from: `"Vivahasya" <${process.env.EMAIL_USER}>`,
      to: lead.email,
      subject: "Welcome to Vivahasya! 💍",
      html: `<h3>Congrats ${lead.name}!</h3><p>Your booking is confirmed.</p>
             <p><b>Password:</b> ${tempPassword}</p>`
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.log("Email failed, but client created.");
    }

    // 5. Finalize Lead Status
    lead.status = "Converted";
    await lead.save();

    res.json({ message: "Client onboarded successfully", credentials: { email: lead.email, password: tempPassword } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;