// controllers/companyController.js
const { pool } = require('../config/db');

// Get all companies with complete information
// Only accessible to super_admin (role_id = 1)
const getAllCompanies = async (req, res) => {
  try {
    // Join with licenses to get license information for each company
    const [companies] = await pool.execute(`
      SELECT c.*, 
             l.id as license_id, 
             l.type as license_type, 
             l.start_date, 
             l.expiry_date, 
             l.status as license_status,
             COUNT(u.id) as user_count
      FROM companies c
      LEFT JOIN licenses l ON c.id = l.company_id
      LEFT JOIN users u ON c.id = u.company_id
      GROUP BY c.id, l.id
    `);

    return res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return res.status(500).json({
      success: false,
      message: 'Şirketler getirilirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get company by ID
// Only accessible to super_admin (role_id = 1)
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get company with its license information
    const [company] = await pool.execute(`
      SELECT c.*, 
             l.id as license_id, 
             l.type as license_type, 
             l.start_date, 
             l.expiry_date, 
             l.status as license_status
      FROM companies c
      LEFT JOIN licenses l ON c.id = l.company_id
      WHERE c.id = ?
    `, [id]);

    if (company.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Şirket bulunamadı'
      });
    }

    // Get users associated with this company
    const [users] = await pool.execute(`
      SELECT id, name, email, role_id, created_at, updated_at
      FROM users
      WHERE company_id = ?
    `, [id]);

    return res.status(200).json({
      success: true,
      data: {
        ...company[0],
        users
      }
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    return res.status(500).json({
      success: false,
      message: 'Şirket getirilirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Create new company
// Only accessible to super_admin (role_id = 1)
const createCompany = async (req, res) => {
  try {
    const { name, status = 'active', licenseType, startDate, expiryDate } = req.body;

    if (!name || !licenseType || !startDate || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen gerekli tüm alanları doldurun'
      });
    }

    // Start a transaction
    await pool.execute('START TRANSACTION');

    // Create company
    const [companyResult] = await pool.execute(
      'INSERT INTO companies (name, status) VALUES (?, ?)',
      [name, status]
    );

    const companyId = companyResult.insertId;

    // Create license for the company
    await pool.execute(
      'INSERT INTO licenses (company_id, type, start_date, expiry_date, status) VALUES (?, ?, ?, ?, ?)',
      [companyId, licenseType, startDate, expiryDate, 'active']
    );

    // Commit transaction
    await pool.execute('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Şirket başarıyla oluşturuldu',
      data: { id: companyId, name, status }
    });
  } catch (error) {
    // Rollback transaction on error
    await pool.execute('ROLLBACK');
    
    console.error('Error creating company:', error);
    return res.status(500).json({
      success: false,
      message: 'Şirket oluşturulurken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update company
// Only accessible to super_admin (role_id = 1)
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, licenseType, startDate, expiryDate, licenseStatus } = req.body;

    // Check if company exists
    const [companyCheck] = await pool.execute(
      'SELECT * FROM companies WHERE id = ?',
      [id]
    );

    if (companyCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Şirket bulunamadı'
      });
    }

    // Start a transaction
    await pool.query('START TRANSACTION');

    // Update company if fields are provided
    if (name || status) {
      let updateQuery = 'UPDATE companies SET ';
      const updateValues = [];
      
      if (name) {
        updateQuery += 'name = ?, ';
        updateValues.push(name);
      }
      
      if (status) {
        updateQuery += 'status = ?, ';
        updateValues.push(status);
      }
      
      // Remove trailing comma and space
      updateQuery = updateQuery.slice(0, -2);
      
      updateQuery += ' WHERE id = ?';
      updateValues.push(id);
      
      await pool.execute(updateQuery, updateValues);
    }

    // Update license if license fields are provided
    if (licenseType || startDate || expiryDate || licenseStatus) {
      // Get current license
      const [licenseCheck] = await pool.execute(
        'SELECT * FROM licenses WHERE company_id = ?',
        [id]
      );

      if (licenseCheck.length > 0) {
        let updateLicenseQuery = 'UPDATE licenses SET ';
        const updateLicenseValues = [];
        
        if (licenseType) {
          updateLicenseQuery += 'type = ?, ';
          updateLicenseValues.push(licenseType);
        }
        
        if (startDate) {
          updateLicenseQuery += 'start_date = ?, ';
          updateLicenseValues.push(startDate);
        }
        
        if (expiryDate) {
          updateLicenseQuery += 'expiry_date = ?, ';
          updateLicenseValues.push(expiryDate);
        }
        
        if (licenseStatus) {
          updateLicenseQuery += 'status = ?, ';
          updateLicenseValues.push(licenseStatus);
        }
        
        // Remove trailing comma and space
        updateLicenseQuery = updateLicenseQuery.slice(0, -2);
        
        updateLicenseQuery += ' WHERE company_id = ?';
        updateLicenseValues.push(id);
        
        await pool.execute(updateLicenseQuery, updateLicenseValues);
      } else {
        // Create new license if none exists
        await pool.execute(
          'INSERT INTO licenses (company_id, type, start_date, expiry_date, status) VALUES (?, ?, ?, ?, ?)',
          [
            id, 
            licenseType || 'trial', 
            startDate || new Date().toISOString().split('T')[0], 
            expiryDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], 
            licenseStatus || 'active'
          ]
        );
      }
    }

    // Commit transaction
    await pool.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: 'Şirket başarıyla güncellendi'
    });
  } catch (error) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    
    console.error('Error updating company:', error);
    return res.status(500).json({
      success: false,
      message: 'Şirket güncellenirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete company
// Only accessible to super_admin (role_id = 1)
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if company exists
    const [companyCheck] = await pool.execute(
      'SELECT * FROM companies WHERE id = ?',
      [id]
    );

    if (companyCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Şirket bulunamadı'
      });
    }

    // Delete company (will cascade to licenses due to FK constraint)
    await pool.execute('DELETE FROM companies WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Şirket başarıyla silindi'
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    return res.status(500).json({
      success: false,
      message: 'Şirket silinirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};