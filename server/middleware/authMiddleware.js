const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route (no token)',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("decoded => ", decoded);

      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [decoded.email]
      );

      if (!rows.length) {
        return res.status(401).json({
          success: false,
          message: 'User not found for this token',
        });
      }

      req.user = rows[0];
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};