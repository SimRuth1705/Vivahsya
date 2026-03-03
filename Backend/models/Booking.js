const mongoose = require('mongoose');

// Sub-schema for individual timeline events (Keep this as is)
const TimelineEventSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  date: { type: String },
  time: { type: String },
  venue: { type: String },
  status: { type: String, default: "Confirmed" },
  schedule: [{ type: String }] 
});

const BookingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, default: 0 }, // Used for Revenue calculation
  type: { 
    type: String, 
    enum: ['Wedding', 'Haldi', 'Engagement', 'Reception'], 
    default: 'Wedding' 
  },
  status: { 
    type: String, 
    enum: ['Confirmed', 'Completed', 'Pending', 'Cancelled'], 
    default: 'Pending' 
  },
  date: { type: String },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });



module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);