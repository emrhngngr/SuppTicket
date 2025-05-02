const express = require('express');
const { getTickets} = require('../controllers/ticketController')
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer();
const router = express.Router();

// Public routes
// router.get("/tickets", protect, getTickets);

// // Protected routes
// router.get('/me', protect, getMe);

module.exports = router;