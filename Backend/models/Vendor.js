const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Catering', 'Photography', 'Florist', 'Venue', 'Decor', 'Entertainment'] 
  },
  phone: { type: String, required: true },
  email: { type: String },
  location: { type: String },
  rating: { type: Number, default: 5, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);