const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const mysql = require("mysql2/promise");

const superAdminModel = {
  getCompanyTopics: async (companyId) => {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM topics WHERE company_id = ?",
        [companyId]
      );

      return { success: true, rows };
    } catch (error) {
      console.error("Get all companies error:", error);
      throw error;
    }
  },
  setCompanyTopic: async (title, description, category_id, company_id) => {
  console.log("company_id ==> ", company_id);
  console.log("category_id ==> ", category_id);
  console.log("description ==> ", description);
  console.log("title ==> ", title);
    try {
      const [result] = await pool.execute(
        "INSERT INTO topics (title, description, category_id, company_id, create_at) VALUES (?, ?, ?, ?, ?)",
        [title, description, category_id, company_id, new Date()]
      );

      if (result.affectedRows === 0) {
        return { success: false, message: "Topic creation failed" };
      }

      return { success: true, message: "Topic created successfully" };
    } catch (error) {
      console.error("Set topic error:", error);
      throw error;
    }
  },
};

module.exports = superAdminModel;
