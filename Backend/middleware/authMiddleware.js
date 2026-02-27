// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const adminOnly = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if user is an owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({ 
        message: "Permission Denied: Only owners can access financial data." 
      });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { adminOnly };