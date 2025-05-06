// routes/userRoutes.js (updated version)
const express = require('express');
const { login, getMe, getUsers, setUser } = require('../controllers/userController');
const { protect, protectSuperAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer();
const router = express.Router();

// Public routes
router.post('/login', upload.none(), login);
router.get('/', protect, getUsers)
router.post('/register', protect, setUser)

// Protected routes
// router.get('/me', protect, getMe);

module.exports = router;