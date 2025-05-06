const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const mysql = require('mysql2/promise');

const superAdminModel = {
  // Super admin login
  login: async (email, password) => {
    try {
      // Find super admin by email
      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);

      if (!rows.length) {
        return { success: false, message: "Admin bulunamadı" };
      }

      const admin = rows[0];
      console.log("admin.password ==> ", admin.password);
      console.log("password ==> ", password);
      const saltRounds = 10;
      console.log("passwordhashed ==> ", await bcrypt.hash(password, saltRounds));

      // Compare password
      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return { success: false, message: "Geçersiz kimlik bilgileri" };
      }

      // Generate new token
      const token = generateToken(email);

      // Update admin with new token
      const [updateResult] = await pool.execute(
        "UPDATE users SET login_token = ? WHERE email = ?",
        [token, email]
      );

      return {
        success: true,
        token: token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email
        }
      };
    } catch (error) {
      console.error("Super admin login error:", error);
      throw error;
    }
  },

  // Create a new company with license
  createCompany: async (companyData) => {
    const { 
      companyName, 
      adminName, 
      adminEmail, 
      adminPassword, 
      licenseType, 
      licenseDuration 
    } = companyData;
    
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Calculate license expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(licenseDuration));
      const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
      
      // Create company record
      const [companyResult] = await connection.execute(
        "INSERT INTO companies (name, status, created_at) VALUES (?, ?, NOW())",
        [companyName, 'active']
      );
      
      const companyId = companyResult.insertId;
      
      // Create license record
      await connection.execute(
        "INSERT INTO licenses (company_id, type, start_date, expiry_date, status) VALUES (?, ?, CURDATE(), ?, 'active')",
        [companyId, licenseType, formattedExpiryDate]
      );
      
      // Hash admin password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      // Create company database
      const dbName = `company_${companyId}`;
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
      
      // Connect to the new database
      const companyPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      
      // Create necessary tables in the new database
      await companyPool.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          login_token VARCHAR(255),
          role ENUM('admin', 'manager', 'member') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Create admin user in the company database
      await companyPool.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
        [adminName, adminEmail, hashedPassword]
      );
      
      await connection.commit();
      
      return {
        success: true,
        message: "Şirket ve lisans başarıyla oluşturuldu",
        companyId,
        dbName
      };
    } catch (error) {
      await connection.rollback();
      console.error("Create company error:", error);
      throw error;
    } finally {
      connection.release();
    }
  },
  
  // Get all company licenses
  getAllCompanies: async () => {
    try {
      const [companies] = await pool.execute(`
        SELECT 
          c.id, 
          c.name AS companyName, 
          c.status, 
          l.type AS licenseType, 
          l.start_date, 
          l.expiry_date, 
          l.status AS licenseStatus
        FROM companies c
        LEFT JOIN licenses l ON c.id = l.company_id
        ORDER BY c.created_at DESC
      `);
      
      return { success: true, companies };
    } catch (error) {
      console.error("Get all companies error:", error);
      throw error;
    }
  },
  
  // Update company license
  updateLicense: async (companyId, licenseType, licenseDuration) => {
    try {
      // Calculate new expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(licenseDuration));
      const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
      
      const [result] = await pool.execute(
        "UPDATE licenses SET type = ?, expiry_date = ?, updated_at = NOW() WHERE company_id = ?",
        [licenseType, formattedExpiryDate, companyId]
      );
      
      if (result.affectedRows === 0) {
        // If no license exists, create a new one
        await pool.execute(
          "INSERT INTO licenses (company_id, type, start_date, expiry_date, status) VALUES (?, ?, CURDATE(), ?, 'active')",
          [companyId, licenseType, formattedExpiryDate]
        );
      }
      
      return { 
        success: true, 
        message: "Lisans başarıyla güncellendi",
        expiryDate: formattedExpiryDate
      };
    } catch (error) {
      console.error("Update license error:", error);
      throw error;
    }
  }

  
};

module.exports = superAdminModel;