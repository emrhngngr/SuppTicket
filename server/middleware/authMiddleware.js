// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Protect routes for authenticated users
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Yetkisiz erişim, token bulunamadı' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const [rows] = await pool.execute(`
      SELECT u.*, r.name as role_name, c.name as company_name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN companies c ON u.company_id = c.id
      WHERE u.email = ?
    `, [decoded.email]);
    
    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Kullanıcı bulunamadı' });
    }
    
    const user = rows[0];
    
    // Check if token matches
    if (user.login_token !== token) {
      return res.status(401).json({ success: false, message: 'Geçersiz token' });
    }
    
    // If user is a company admin, check company and license status
    if (user.role_id === 2) { // admin role_id
      const [companyResult] = await pool.execute(`
        SELECT c.*, l.expiry_date, l.status as license_status 
        FROM companies c
        JOIN licenses l ON c.id = l.company_id
        WHERE c.id = ? AND c.status = 'active'
      `, [user.company_id]);
      
      if (!companyResult.length) {
        return res.status(403).json({ success: false, message: 'Geçersiz şirket' });
      }
      
      const company = companyResult[0];
      
      // Check if license is active and not expired
      const currentDate = new Date();
      const expiryDate = new Date(company.expiry_date);
      
      if (company.license_status !== 'active' || currentDate > expiryDate) {
        return res.status(403).json({ success: false, message: 'Lisans süresi dolmuş veya aktif değil' });
      }
      
      // Add company info to request
      req.company = {
        id: company.id,
        name: company.name,
        status: company.status
      };
    }
    
    // Add user info to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role_name,
      company_id: user.company_id
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Geçersiz token' });
    }
    return res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
};

// Middleware to ensure user is a super admin
const protectSuperAdmin = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Yetkisiz erişim, token bulunamadı' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database with role information
    const [rows] = await pool.execute(`
      SELECT u.*, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `, [decoded.email]);
    
    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Kullanıcı bulunamadı' });
    }
    
    const user = rows[0];
    
    // Check if token matches
    if (user.login_token !== token) {
      return res.status(401).json({ success: false, message: 'Geçersiz token' });
    }
    
    // Check if user is super_admin (role_id = 1)
    if (user.role_id !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için super admin yetkisi gerekiyor'
      });
    }
    
    // Add user info to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role_name
    };
    
    next();
  } catch (error) {
    console.error('Super admin middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Geçersiz token' });
    }
    return res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
};

// Middleware to ensure user is a company admin
const protectCompanyAdmin = async (req, res, next) => {
  try {
    await protect(req, res, () => {
      // After protect middleware has run, check if user is company admin
      if (req.user.role_id !== 2) { // admin role_id
        return res.status(403).json({
          success: false,
          message: 'Bu işlem için şirket admin yetkisi gerekiyor'
        });
      }
      next();
    });
  } catch (error) {
    console.error('Company admin middleware error:', error);
    return res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
};

module.exports = {
  protect,
  protectSuperAdmin,
  protectCompanyAdmin
};