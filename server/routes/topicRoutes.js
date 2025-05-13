const express = require("express");
const { getTopics, setTopic } = require("../controllers/topicController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

const upload = multer();
const router = express.Router();

// Public routes
router.get("/", protect, getTopics);
router.post("/", protect, setTopic);



// Protected routes
// router.get('/me', protect, getMe);

module.exports = router;
