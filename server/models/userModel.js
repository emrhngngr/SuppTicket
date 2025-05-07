// models/userModel.js (updated version)
const { uuid } = require("uuidv4");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const mysql = require('mysql2/promise');
const { pool } = require("../config/db");
const { getRoleName } = require("../utils/roleMap");



const userModel = {
  // Find user by email in company database
  findByEmail: async (email) => {
    try {
      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      // 1. Get user and company_id
      const [userResult] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
  
      if (!userResult.length) {
        return { success: false, message: "Kullanıcı bulunamadı" };
      }
  
      const user = userResult[0];
      const companyId = user.company_id;
      console.log("companyId ==> ", companyId);
  
      // 2. Check company and license unless user is superadmin
      let companyName = null;
      let licenseExpiry = null;
  
      if (companyId !== 0) {
        const [companyResult] = await pool.execute(`
          SELECT companies.id, companies.name, licenses.expiry_date, licenses.status 
          FROM companies
          JOIN licenses ON companies.id = licenses.company_id
          WHERE companies.id = ? AND companies.status = 'active'
        `, [companyId]);
  
        if (!companyResult.length) {
          return { success: false, message: "Geçersiz şirket" };
        }
  
        const company = companyResult[0];
        const currentDate = new Date();
        const expiryDate = new Date(company.expiry_date);
  
        if (company.status !== 'active' || currentDate > expiryDate) {
          return { success: false, message: "Lisans süresi dolmuş veya aktif değil" };
        }
  
        companyName = company.name;
        licenseExpiry = company.expiry_date;
      }
  
      // 3. Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, message: "Geçersiz kimlik bilgileri" };
      }
  
      // 4. Generate token
      const token = generateToken(email);
  
      // 5. Update user token
      const [updateResult] = await pool.execute(
        "UPDATE users SET login_token = ? WHERE email = ?",
        [token, email]
      );
  
      if (updateResult.affectedRows === 0) {
        return { success: false, message: "Token güncellenemedi" };
      }
  
      // 6. Return success
      return {
        success: true,
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: getRoleName(user.role_id)
        },
        companyName: companyName,
        licenseExpiry: licenseExpiry
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  setUser: async (name, email, password, role_id, company_id) => {
    try {
      // Check if the email already exists in the database
      const [existingUser] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      
      // If an existing user is found, return a message
      if (existingUser.length > 0) {
        return { success: false, message: "This email is already registered." };
      }
  
      // If email is unique, continue with user creation
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuid();
      const token = generateToken(email);
  
      const [result] = await pool.execute(
        "INSERT INTO users (id, name, email, password, role_id, company_id, login_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, name, email, hashedPassword, role_id, company_id, token]
      );
  
      return { success: true, message: "User successfully added." };
    } catch (error) {
      console.error("Error setting user:", error);
      return { success: false, message: "An error occurred while adding the user." };
    }
  },

  getProfile: async (email) => {
    try {
      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
      if (rows.length === 0) {
        return { success: false, message: "User not found" };
      }
      const user = rows[0];
      return { success: true, user };
    } catch (error) {
      console.error("Error getting user profile:", error);
      return { success: false, message: "Error retrieving user profile" };
    }
  },
  
  

};

module.exports = userModel;