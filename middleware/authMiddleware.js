const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Make sure model file name matches exactly

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request object
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: 'User no longer exists' });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

