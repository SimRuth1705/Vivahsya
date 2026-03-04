const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  // --- CORE INFO ---
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    default: "Resort" 
  },
  rating: { 
    type: String, 
    default: "5.0" 
  },
  reviews: { 
    type: String, 
    default: "0" 
  },

  // --- IMAGES (GOOGLE DRIVE LINKS) ---
  image: { 
    type: String, 
    required: true 
  }, // Main Cover Thumbnail
  
  gallery: [{ 
    type: String 
  }], // Array to store multiple detail-page images

  // --- CAPACITY & FACILITIES ---
  pax: { 
    type: String, 
    placeholder: "e.g. 500-800 Pax" 
  },
  rooms: { 
    type: String, 
    placeholder: "e.g. 50 Rooms" 
  },
  moreCount: { 
    type: String, 
    placeholder: "e.g. +3 Spaces" 
  },

  // --- ADDRESS & CONTENT ---
  address: { 
    type: String, 
    default: "Main Road, India" 
  },
  description: { 
    type: String 
  },

  // --- PRICING (Optional) ---
  vegPrice: { type: String },
  nonVegPrice: { type: String },
  pricingText: { type: String },
  price: { type: String },
  priceUnit: { type: String }

}, { timestamps: true });

// Check if model exists before creating to prevent OverwriteModelError in development
module.exports = mongoose.models.Venue || mongoose.model('Venue', VenueSchema);