// controllers/userController.js
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log("req.body ==> ", req.body);
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Lütfen tüm alanları doldurun",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Şifre en az 6 karakter uzunluğunda olmalıdır",
      });
    }

    // Check if email is valid using regex
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Lütfen geçerli bir email adresi girin",
      });
    }

    // Register user
    const result = await userModel.register(name, email, password);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // Create token
    const token = generateToken(result.user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    console.error("Register controller error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Lütfen email ve şifre girin",
      });
    }

    // Attempt login
    const result = await userModel.login(email, password);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message,
      });
    }

    // Create token
    const token = generateToken(result.user.id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    console.error("Login controller error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const { id, name, email, role } = req.user;

    res.status(200).json({
      success: true,
      data: {
        id,
        name,
        email,
        role,
      },
    });
  } catch (error) {
    console.error("Get me controller error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};
