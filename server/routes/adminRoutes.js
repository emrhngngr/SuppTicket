// routes/userRoutes.js
const express = require("express");
const { register, login, getMe } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

const upload = multer();
const router = express.Router();

// Public routes
router.post("/register", upload.none(), register);
router.post("/login", upload.none(), login);

// Protected routes
router.get("/me", protect, getMe);

module.exports = router;
