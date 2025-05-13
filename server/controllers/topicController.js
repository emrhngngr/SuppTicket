// controllers/superAdminController.js
const topicModel = require('../models/topicModel');

// Get all companies with license info
const getTopics = async (req, res) => {
  try {
    const result = await topicModel.getAllCompanyTopics(req.user.company_id);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Errors occurred while fetching topics'
    });
  }
}
const setTopic = async (req, res) => {
console.log("req ==> ", req);
  try {
    const { company_id } = req.user;
    const { title, description, category_id} = req.body.topics 
    const result = await topicModel.setCompanyTopic(title, description, category_id, company_id );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Set topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Errors occurred while setting topic'
    });
  }
}
module.exports = {
  getTopics,
  setTopic
};