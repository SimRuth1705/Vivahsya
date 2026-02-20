const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Wedding', 'Birthday', 'Corporate', 'Anniversary'] 
  },
  date: { type: String, required: true }, // Keeping String to match your calendar format
  startTime: { type: String }, 
  endTime: { type: String },
  amount: { type: String, required: true },
  
  // --- THE RELATIONSHIP BRIDGE ---
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', // Links to CRM collection
    required: true 
  },
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor' // Links to Vendors collection
  },
  leadId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lead' 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  // --- STATUS & METADATA ---
  source: { 
    type: String, 
    default: 'Website' 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);