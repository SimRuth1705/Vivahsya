const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  source: { type: String, default: 'Website' }, // e.g., Instagram, Referral, Website
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Converted', 'Lost'], 
    default: 'New' 
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);