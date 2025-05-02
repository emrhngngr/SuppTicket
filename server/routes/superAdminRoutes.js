// routes/superAdminRoutes.js
const express = require('express');
const { 
  login, 
  createCompany, 
  getAllCompanies, 
  updateLicense 
} = require('../controllers/superAdminController');
const { protectSuperAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer();
const router = express.Router();

// Public routes
router.post('/login', upload.none(), login);

// Protected routes
router.post('/companies', protectSuperAdmin, upload.none(), createCompany);
router.get('/companies', protectSuperAdmin, getAllCompanies);
router.put('/companies/:companyId/license', protectSuperAdmin, upload.none(), updateLicense);

module.exports = router;