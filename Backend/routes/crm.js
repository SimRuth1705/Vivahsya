const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Lead = require("../models/Lead");
const Booking = require("../models/Booking");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const { protect, adminOnly } = require("../middleware/authMiddleware");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 2. The Confirmation Route
// ... (imports and transporter config same as before)

router.post("/confirm/:id", protect, adminOnly, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const existingBooking = await Booking.findOne({ leadId: lead._id });
    if (existingBooking) return res.status(400).json({ message: "Lead already confirmed." });

    const rawPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // B. Create/Update Client User Account
    let user = await User.findOne({ username: lead.email });

    if (!user) {
      console.log("🛠️ Creating new client user...");
      user = await User.create({
        name: lead.name,
        username: lead.email, // Using email as the login username
        password: hashedPassword,
        role: "client", // ✅ This now works because of the model update
        status: "Active",
        leadId: lead._id,
      });
    } else {
      console.log("🔄 Updating existing client credentials...");
      user.password = hashedPassword;
      user.leadId = lead._id;
      await user.save();
    }

    // C. Lead & Booking Sync
    lead.status = "Confirm";
    await lead.save();

    const newBooking = await Booking.create({
      title: `${lead.name}'s Event`,
      leadId: lead._id,
      clientId: user._id,
      date: lead.date,
      status: "Confirmed",
      amount: lead.budget || "0",
      type: lead.eventType || "Wedding",
    });

    // D. Email Delivery
    console.log(`📧 Sending email to: ${lead.email} from: ${process.env.SENDGRID_FROM_EMAIL}`);
    const [sgResponse] = await sgMail.send({
      from: process.env.SENDGRID_FROM_EMAIL,
      to: lead.email,
      subject: "Welcome to Vivahasya - Portal Access",
      html: `<h3>Wedding Portal Activated</h3>
             <p>Log in with Username: <b>${lead.email}</b> and Password: <b>${rawPassword}</b></p>`
    });
    console.log(`📬 SendGrid response: ${sgResponse.statusCode}`);

    console.log(`✅ Success: Booking & User created for ${lead.name}`);
    res.json({ message: "Success!", booking: newBooking });

  } catch (error) {
    console.error("❌ CRM Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;