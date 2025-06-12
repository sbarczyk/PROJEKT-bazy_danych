const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token = null;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success:false, message:'Brak tokena.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ success:false, message:'Token nieprawidłowy.' });
  }
};


// middleware/auth.js
exports.adminOnly = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ success:false, message:'Tylko admin może to robić.' });
  }
  next();
};
