const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- STEP 1: VERIFY TOKEN & ATTACH USER ---
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request (including role and leadId)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User session invalid' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token found' });
  }
};

// --- STEP 2: ROLE GATEKEEPERS ---

// Admin & Staff access
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'owner' || req.user.role === 'employee')) {
    next();
  } else {
    res.status(403).json({ message: "Admin access required." });
  }
};

// Client only access
const clientOnly = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    next();
  } else {
    res.status(403).json({ message: "Client portal access only." });
  }
};

module.exports = { protect, adminOnly, clientOnly };