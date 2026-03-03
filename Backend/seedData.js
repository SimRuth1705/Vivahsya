const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('./models/Lead');
const Booking = require('./models/Booking');
const Vendor = require('./models/Vendor');

dotenv.config();

const seedAtlas = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🛰️ Connected to Atlas for seeding...");

    // 1. Add Dummy Leads (Matching your specific Schema)
    const leads = await Lead.insertMany([
      { 
        name: "Rahul Sharma", 
        email: "rahul@example.com", 
        contact: "9876543210", // 👈 Matches your 'contact' field
        location: "Mumbai", 
        budget: "500000", 
        status: "New" // 👈 Matches your enum
      },
      { 
        name: "Priya Patel", 
        email: "priya@example.com", 
        contact: "9822113344", 
        location: "Pune", 
        budget: "800000", 
        status: "Converted" // 👈 Matches your enum
      }
    ]);
    console.log("✅ 2 Leads Added");

    // 2. Add Dummy Vendor
    const vendor = await Vendor.create({
      name: "Elite Catering", 
      category: "Catering", 
      phone: "9000011122", 
      email: "food@elite.com", 
      location: "Mumbai", 
      rating: 5
    });
    console.log("✅ 1 Vendor Added");

    // 3. Add Dummy Bookings (For the Dashboard Charts)
    await Booking.insertMany([
      { 
        title: "Sharma Wedding", 
        clientId: new mongoose.Types.ObjectId(), 
        leadId: leads[1]._id,
        vendorId: vendor._id,
        amount: "450000", 
        type: "Wedding", 
        status: "Confirmed", 
        date: "2026-05-15" 
      },
      { 
        title: "Priya Haldi", 
        clientId: new mongoose.Types.ObjectId(), 
        leadId: leads[1]._id,
        amount: "75000", 
        type: "Haldi", 
        status: "Pending", 
        date: "2026-05-14" 
      }
    ]);
    console.log("✅ 2 Bookings Added");

    console.log("🎯 Atlas is now populated!");
    process.exit();
  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
};

seedAtlas();