const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true }, // <-- CHANGED FROM 'phone' TO 'contact'
  email: { type: String },
  eventType: { type: String },
  date: { type: String },
  duration: { type: String },
  tradition: { type: String },
  budget: { type: String },
  location: { type: String },
  guestCount: { type: Number },
  services: [{ type: String }],
  source: { type: String, default: 'Website' },
  status: { 
    type: String, 
    enum: ['On Talk', 'Follow Up', 'Confirm', 'Lost', 'New', 'Contacted', 'Converted'], 
    default: 'On Talk' 
  },
  notes: { type: String },
  enquireDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);