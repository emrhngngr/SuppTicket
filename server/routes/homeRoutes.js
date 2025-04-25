const express = require('express');
const router = express.Router();

// GET /api/home
router.get('/', (req, res) => {
    res.json({ message: 'MainPage works!' });
});

module.exports = router;
