const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Needed to hash the auto-generated password
const Lead = require('../models/Lead');
const Booking = require('../models/Booking');
const Client = require('../models/Client'); 
const User = require('../models/User');
const { adminOnly } = require('../middleware/authMiddleware');

// --- 1. GET ALL CLIENTS (For the Bookings page dropdown) ---
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 2. THE CONVERSION PIPELINE (Confirm Lead -> Booking) ---
// --- 2. THE CONVERSION PIPELINE (Confirm Lead -> Booking) ---
router.post('/confirm/:id', async (req, res) => {
  try {
    // STEP 1: Find the Lead
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found in database." });

    // STEP 2: Create the Client record
    const newClient = new Client({
      name: lead.name || "Unknown Client",
      phone: lead.contact || lead.phone || "Not Provided", // Safe fallback
      email: lead.email || "pending@client.com",
      location: lead.location || "TBD",
      events: 1,
      totalSpent: lead.budget || '0'
    });
    const savedClient = await newClient.save();

    // STEP 3: Create the Booking entry
    const newBooking = new Booking({
      title: `${lead.name}'s ${lead.eventType || 'Event'}`,
      type: lead.eventType || 'Wedding',
      date: lead.date || 'TBD',
      amount: lead.budget || '0',
      clientId: savedClient._id,
      leadId: lead._id,
      status: 'Confirmed',
      source: 'CRM Conversion'
    });
    await newBooking.save();

    // STEP 4: Auto-Generate Client Credentials (Safely handling duplicates)
    const userEmail = lead.email || `client_${savedClient._id}@vivahasya.com`;
    const existingUser = await User.findOne({ email: userEmail });
    let tempPassword = "Already exists"; // Fallback message if user is already there

    // Only create a new user if one doesn't already exist
    if (!existingUser) {
      tempPassword = Math.random().toString(36).slice(-8); 
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(tempPassword, salt);

      const newUser = new User({
        name: lead.name || "Unknown",
        email: userEmail,
        password: hashedPassword, 
        role: 'client',
        leadId: lead._id
      });
      await newUser.save();
    }

    // STEP 5: Update the original Lead's status
    lead.status = 'Confirm'; 
    
    // 👇 THE FIX FOR OLD DATABASE ENTRIES: Force the contact field if it's missing
    if (!lead.contact) {
      lead.contact = lead.phone || "Not Provided";
    }
    
    await lead.save();

    // STEP 6: Send success back to React
    res.status(200).json({ 
      message: "Success! Lead converted to Client and Event Booked.",
      credentials: { 
        email: userEmail, 
        password: tempPassword 
      }
    });

  } catch (err) {
    console.error("CRM Conversion Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;