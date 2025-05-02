// utils/roleMap.js
const roleMap = {
    1: "super_admin",
    2: "admin",
    3: "user"
  };
  
  const getRoleName = (roleId) => roleMap[roleId] || "user";
  
  module.exports = { roleMap, getRoleName };
  