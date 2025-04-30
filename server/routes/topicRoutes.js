const express = require('express');
const { getTopics } = require('../controllers/topicController')
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer();
const router = express.Router();

// Public routes
router.get("/topics", protect, getTopics);

// // Protected routes
// router.get('/me', protect, getMe);

module.exports = router;