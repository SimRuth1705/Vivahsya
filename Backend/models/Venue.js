const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number },
  imageUrl: { type: String }, // 👈 Stores path like "/uploads/venues/taj-mahal.jpg"
  description: { type: String },
  price: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Venue', VenueSchema);