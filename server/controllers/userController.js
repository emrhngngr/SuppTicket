// controllers/userController.js (updated version)
const userModel = require("../models/userModel");
const { pool } = require("../config/db");
const { getRoleName, getRoleId } = require("../utils/roleMap");

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

// Get all users (for super admin)
const getUsers = async (req, res) => {
  try {
    const result = await userModel.findByEmail(req.user.email);
    const role = getRoleName(result.role_id);
    console.log("role ==> ", role);
    if (role === "super_admin") {
      const [users] = await pool.execute("SELECT * FROM users");
      result.users = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: getRoleName(user.role_id),
      }));
    } else if (role === "admin") {
      const [users] = await pool.execute(
        "SELECT * FROM users WHERE company_id = ?",
        [result.company_id]
      );
      result.users = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: getRoleName(user.role_id),
      }));
    } else {
      return res.status(403).json({
        success: false,
        message: "Yetkisiz erişim",
      });
    }

    if (!result.success) {
      return res.status(200).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Kullanıcı bilgileri alınırken hata oluştu",
    });
  }
};

const setUser = async (req, res) => {
  const user = await userModel.findByEmail(req.user.email);
  const role = getRoleName(user.role_id);
  if (role === "super_admin") {
    try {
      const { name, email, password, role, companyId } = req.body;
      const role_id = getRoleId(role);

      const result = await userModel.setUser(
        name,
        email,
        password,
        role_id,
        companyId
      );
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.status(200).json(result);
    } catch (error) {
      console.error("Set user error:", error);
      res.status(500).json({
        success: false,
        message: "Kullanıcı bilgileri alınırken hata oluştu",
      });
    }
  } else if (role === "admin") {
    try {
      const { name, email, password, role } = req.body;
      const role_id = getRoleId(role);

      const result = await userModel.setUser(
        name,
        email,
        password,
        role_id,
        user.company_id
      );
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.status(200).json(result);
    } catch (error) {
      console.error("Set user error:", error);
      res.status(500).json({
        success: false,
        message: "Kullanıcı bilgileri alınırken hata oluştu",
      });
    }
  }
};

module.exports = {
  login,
  getMe,
  getUsers,
  setUser,
};
