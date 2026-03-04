const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request, ensuring role and leadId are available
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401).json({ message: 'Token invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Gatekeeper for Admin/Staff area
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'owner' || req.user.role === 'employee')) {
    next();
  } else {
    res.status(403).json({ message: 'Denied: Admin access only' });
  }
};

// ✅ ADDED: Gatekeeper for Client Portal
const clientOnly = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    next();
  } else {
    res.status(403).json({ message: 'Denied: Client access only' });
  }
};

module.exports = { protect, adminOnly, clientOnly };