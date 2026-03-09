require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const User = require('./models/User');
const fs = require('fs');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const bookings = await Booking.find({});
        const results = [];

        for (const b of bookings) {
            const user = await User.findOne({ leadId: b.leadId });
            results.push({
                bookingId: b._id,
                title: b.title,
                leadId: b.leadId,
                timelineLength: b.timeline ? b.timeline.length : 0,
                timeline: b.timeline,
                hasUser: !!user,
                userId: user ? user._id : null,
                userRole: user ? user.role : null,
                userLeadId: user ? user.leadId : null
            });
        }

        fs.writeFileSync('output.json', JSON.stringify(results, null, 2), 'utf-8');

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}
check();
