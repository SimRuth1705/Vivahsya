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
  type: { type: String, required: true }, 
  date: { type: String, required: true },
  startTime: { type: String }, 
  endTime: { type: String },
  amount: { type: String, required: true },
  
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // 👇 LINK TO THE NEW VENUE MODEL
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }, 

  timeline: [TimelineEventSchema], 
  source: { type: String, default: 'Website' },
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);