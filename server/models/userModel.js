// models/userModel.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const userModel = {
  // Find user by email
  findByEmail: async (email) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  // Register new user
  register: async (name, email, password) => {
    try {
      // Check if user already exists
      const [existingUser] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      if (existingUser.length > 0) {
        return { success: false, message: 'Email zaten kullanımda' };
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 'user']
      );
      
      if (result.affectedRows === 1) {
        // Get the newly created user
        const [newUser] = await pool.execute(
          'SELECT id, name, email, role FROM users WHERE id = ?',
          [result.insertId]
        );
        
        return { 
          success: true, 
          user: newUser[0]
        };
      } else {
        return { success: false, message: 'Kullanıcı kaydı başarısız oldu' };
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Login method
  login: async (email, password) => {
    try {
      // Find user
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      if (!rows.length) {
        return { success: false, message: 'Kullanıcı bulunamadı' };
      }
      
      const user = rows[0];
      
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return { success: false, message: 'Geçersiz kimlik bilgileri' };
      }
      
      // Don't return password in the user object
      const { password: _, ...userWithoutPassword } = user;
      
      return { 
        success: true, 
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};

module.exports = userModel;