require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const booking = await Booking.findOne({}).populate('venueId');
        console.log("SUCCESS");
    } catch (e) {
        console.log("ERROR THROWN:", e.name, e.message);
    } finally {
        mongoose.disconnect();
    }
}
check();
