const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  
  // 👇 Removed the strict 'enum' array here so it accepts any event type from the CRM
  type: { type: String, required: true }, 
  
  date: { type: String, required: true },
  startTime: { type: String }, 
  endTime: { type: String },
  amount: { type: String, required: true },
  
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor' 
  },
  leadId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lead' 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  source: { type: String, default: 'Website' },
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

// 👇 Added the safety check here
module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);