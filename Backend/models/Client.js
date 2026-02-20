const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  location: { type: String },
  events: { type: Number, default: 0 },
  totalSpent: { type: String, default: '0' }
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);