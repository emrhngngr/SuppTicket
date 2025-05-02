// controllers/userController.js (updated version)
const userModel = require("../models/userModel");
const { pool } = require("../config/db");

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password, companyId } = req.body;

    if (!name || !email || !password || !companyId) {
      return res.status(400).json({
        success: false,
        message: "Lütfen tüm alanları doldurun",
      });
    }

    // Check if company exists and has valid license
    const [companyResult] = await pool.execute(
      `
      SELECT c.id, l.expiry_date, l.status 
      FROM companies c
      JOIN licenses l ON c.id = l.company_id
      WHERE c.id = ? AND c.status = 'active'
    `,
      [companyId]
    );

    if (!companyResult.length) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz şirket",
      });
    }

    const company = companyResult[0];

    // Check if license is active and not expired
    const currentDate = new Date();
    const expiryDate = new Date(company.expiry_date);

    if (company.status !== "active" || currentDate > expiryDate) {
      return res.status(403).json({
        success: false,
        message: "Lisans süresi dolmuş veya aktif değil",
      });
    }

    const result = await userModel.register(companyId, name, email, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Kullanıcı kaydı sırasında hata oluştu",
    });
  }
};
// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await userModel.login(email, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Giriş sırasında hata oluştu",
      line: error.lineNumber,
    });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    const result = await userModel.getProfile(req.user.id, req.companyPool);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Profil bilgileri alınırken hata oluştu",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
