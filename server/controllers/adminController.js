const express = require("express");
const {
  getAllUsers,
  deleteUser,
  createUser,
} = require("./adminController");
const router = express.Router();

// Admin işlemleri
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
