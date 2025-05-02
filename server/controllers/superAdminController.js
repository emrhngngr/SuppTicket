// controllers/superAdminController.js
const superAdminModel = require('../models/superAdminModel');

// Super admin login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email ve şifre gereklidir'
      });
    }
    
    const result = await superAdminModel.login(email, password);
    
    if (!result.success) {
      return res.status(401).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Super admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Create new company with license
const createCompany = async (req, res) => {
  try {
    const { 
      companyName, 
      adminName, 
      adminEmail, 
      adminPassword, 
      licenseType, 
      licenseDuration 
    } = req.body;
    
    // Validate input
    if (!companyName || !adminName || !adminEmail || !adminPassword || !licenseType || !licenseDuration) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar doldurulmalıdır'
      });
    }
    
    const result = await superAdminModel.createCompany({
      companyName,
      adminName,
      adminEmail,
      adminPassword,
      licenseType,
      licenseDuration
    });
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      message: 'Şirket oluşturulurken hata oluştu'
    });
  }
};

// Get all companies with license info
const getAllCompanies = async (req, res) => {
  try {
    const result = await superAdminModel.getAllCompanies();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Şirketler listelenirken hata oluştu'
    });
  }
};

// Update company license
const updateLicense = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { licenseType, licenseDuration } = req.body;
    
    if (!companyId || !licenseType || !licenseDuration) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar doldurulmalıdır'
      });
    }
    
    const result = await superAdminModel.updateLicense(
      companyId,
      licenseType,
      licenseDuration
    );
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Update license error:', error);
    res.status(500).json({
      success: false,
      message: 'Lisans güncellenirken hata oluştu'
    });
  }
};

module.exports = {
  login,
  createCompany,
  getAllCompanies,
  updateLicense
};