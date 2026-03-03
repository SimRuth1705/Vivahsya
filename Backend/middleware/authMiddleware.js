const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. The Protect Middleware
// Ensure the name here is exactly 'protect'
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user to request (including role and leadId)
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. The AdminOnly Middleware
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'owner')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

// 3. THE EXPORT (This is line 33 where your error is)
module.exports = { protect, adminOnly };