const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Weddings', 'Decor', 'Photography'] 
  },
  coverImage: { 
    type: String, 
    required: true 
  }, 
  images: [{ 
    type: String 
  }] 
}, { timestamps: true });

module.exports = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);