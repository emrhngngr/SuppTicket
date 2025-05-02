// routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const { protectSuperAdmin } = require('../middleware/authMiddleware');
const companyController = require('../controllers/companyController');

router.get('/', protectSuperAdmin, companyController.getAllCompanies);
router.post('/', protectSuperAdmin, companyController.createCompany);
router.get('/:id', protectSuperAdmin, companyController.getCompanyById);
router.put('/:id', protectSuperAdmin, companyController.updateCompany);
router.delete('/:id', protectSuperAdmin, companyController.deleteCompany);

module.exports = router;