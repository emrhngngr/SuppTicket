// models/userModel.js (updated version)
const { uuid } = require("uuidv4");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const mysql = require('mysql2/promise');
const { pool } = require("../config/db");
const { getRoleName } = require("../utils/roleMap");



const userModel = {
  // Find user by email in company database
  findByEmail: async (companyPool, email) => {
    try {
      const [rows] = await companyPool.execute("SELECT * FROM users WHERE email = ?", [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  },

  // Register new user in company database
  register: async (companyId, name, email, password, role = "member") => {
    // Connect to company database
    const dbName = `company_${companyId}`;
    const companyPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0
    });
    
    try {
      // Check if user already exists
      const [existingUser] = await companyPool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return { success: false, message: "Email zaten kullanımda" };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Generate token
      const token = generateToken(email);

      // Create new user
      const [result] = await companyPool.execute(
        "INSERT INTO users (name, email, password, login_token, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, token, role]
      );

      if (result.affectedRows === 1) {
        // Get the newly created user
        const [newUser] = await companyPool.execute(
          "SELECT id, name, email, role FROM users WHERE id = ?",
          [result.insertId]
        );

        return {
          success: true,
          user: newUser[0],
          token
        };
      } else {
        return { success: false, message: "Kullanıcı kaydı başarısız oldu" };
      }
    } catch (error) {
      console.error("Register error:", error);
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
  }
  

};

module.exports = userModel;