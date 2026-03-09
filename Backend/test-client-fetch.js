require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Booking = require('./models/Booking');

async function testFetch() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const clientUser = await User.findOne({ role: 'client' }).populate('leadId');
        if (!clientUser) {
            console.log("No client user found");
            return;
        }

        console.log(`Found client: ${clientUser.username}, leadId: ${clientUser.leadId ? clientUser.leadId._id : 'none'}`);

        const token = jwt.sign(
            { id: clientUser._id, role: clientUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        console.log(`Generated Token: ${token.substring(0, 20)}...`);

        const response = await fetch('http://localhost:5000/api/bookings/my-booking', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const statusCode = response.status;
        const data = await response.json();

        console.log(`API Status: ${statusCode}`);
        console.log(`API Data Response:`);
        console.log(JSON.stringify(data, null, 2));

    } catch (e) {
        console.error("Test Error:", e);
    } finally {
        mongoose.disconnect();
    }
}

testFetch();
