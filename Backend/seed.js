const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
require('dotenv').config();

const seedAdmin = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const adminEmail = 'admin@vivahasya.com';
    
    // Explicitly check if User is a function/model
    if (typeof User !== 'function') {
        console.error("❌ Error: User is not a valid Mongoose model. Check your export in User.js");
        process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`⚠️ Admin with email ${adminEmail} already exists!`);
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      name: 'Vivahasya Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'owner',
      status: 'Active'
    });

    await adminUser.save();
    console.log("------------------------------------------");
    console.log("🚀 OWNER ACCOUNT CREATED SUCCESSFULLY!");
    console.log("Email: " + adminEmail);
    console.log("Password: admin123");
    console.log("------------------------------------------");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();