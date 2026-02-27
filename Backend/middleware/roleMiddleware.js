// backend/middleware/roleMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectOwner = async (req, res, next) => {
  let token;

  // 1. Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 2. Fetch user and check role
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.role === 'owner') {
        req.user = user;
        next();
      } else {
        res.status(403).json({ message: "Access denied: Owners only." });
      }
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protectOwner };