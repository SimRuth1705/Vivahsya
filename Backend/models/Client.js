const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  location: { type: String },
  events: { type: Number, default: 0 },
  totalSpent: { type: String, default: '0' }
}, { timestamps: true });

// Uses the safety check so it never throws an OverwriteModelError
module.exports = mongoose.models.Client || mongoose.model('Client', ClientSchema);