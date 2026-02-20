// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');


// Load environment variables
dotenv.config();

console.log("1. Script started...");
console.log("2. Checking Mongo URI...", process.env.MONGO_URI ? "✅ Found" : "❌ MISSING");

if (!process.env.MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('3. ✅ Connected to MongoDB');
    seedOwner();
  })
  .catch(err => {
    console.error('❌ Database Connection Error:', err);
    process.exit(1);
  });

const seedOwner = async () => {
  try {
    console.log("4. Checking for existing admin...");
    const existingUser = await User.findOne({ email: "admin@eventapp.com" });
    
    if (existingUser) {
      console.log('⚠️ Owner account already exists.');
      console.log('👉 Login with: admin@eventapp.com / admin123');
      process.exit();
    }

    console.log("5. Creating new Owner...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const owner = new User({
      name: "Super Admin",
      email: "admin@eventapp.com",
      password: hashedPassword,
      role: "owner"
    });

    await owner.save();
    console.log('🎉 Owner Account Created Successfully!');
    console.log('👉 Email: admin@eventapp.com');
    console.log('👉 Password: admin123');
    process.exit();

  } catch (error) {
    console.error("❌ Error creating user:", error);
    process.exit(1);
  }
};