const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Lead = require("../models/Lead");
const Booking = require("../models/Booking");
const Client = require("../models/Client");
const User = require("../models/User");
const { adminOnly, protect } = require("../middleware/authMiddleware");

// ✅ GET ALL CLIENTS (For Admin Dashboard)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch clients", error: err.message });
  }
});

router.post("/confirm/:id", adminOnly, async (req, res) => {
  try {
    // 1. Find the Lead
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found." });

    // 2. Setup Credentials Logic
    const username = lead.name;
    const userEmail = lead.email;
    const cleanName = lead.name.replace(/\s/g, "").toLowerCase();
    const tempPassword = `${cleanName.slice(0, 4)}@26`;

    // 3. Create Client & Booking (Database Work)
    const newClient = new Client({
      name: lead.name,
      phone: lead.contact,
      email: lead.email,
      location: lead.location,
      totalSpent: lead.budget || "0",
    });
    const savedClient = await newClient.save();

    const newBooking = new Booking({
      title: `${lead.name}'s Event`,
      clientId: savedClient._id,
      leadId: lead._id,
      status: "Confirmed",
    });
    await newBooking.save();

    // 4. Create User for Login
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(tempPassword, salt);

      user = new User({
        name: username,
        email: userEmail,
        password: hashedPassword,
        role: "client",
        leadId: lead._id,
      });
      await user.save();
    }

    // 5. NODEMAILER LOGIC (Must be defined before .sendMail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Vivahasya Support" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your Vivahasya Booking is Confirmed! 💍",
      html: `
        <div style="font-family: sans-serif; border: 1px solid #c6b59c; padding: 20px; border-radius: 10px;">
          <h2 style="color: #b6a27f;">Congratulations ${username}!</h2>
          <p>Your wedding booking is confirmed. Use these credentials to log in to your portal:</p>
          <div style="background: #fdfaf0; padding: 15px; border-radius: 8px;">
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Password:</strong> ${tempPassword}</p>
            <p><strong>Login URL:</strong> http://localhost:5173/login</p>
          </div>
          <p><em>Note: Your password is the first 4 letters of your name + @26.</em></p>
        </div>
      `,
    };

    // 6. Execute Send (With error logging)
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Success: Email sent to ${userEmail}`);
    } catch (mailErr) {
      console.error("❌ Mailer Error Details:", mailErr.message);
      // We don't return 500 here because the DB work is already done!
    }

    // 7. Update Lead Status
    lead.status = "Converted";
    await lead.save();

    res.status(200).json({
      message: "Client onboarded and credentials emailed.",
      credentials: { username, password: tempPassword },
    });
  } catch (err) {
    console.error("Conversion Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error during conversion." });
  }
});

module.exports = router;
