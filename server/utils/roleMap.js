// utils/roleMap.js
const roleMap = {
    1: "super_admin",
    2: "admin",
    3: "user"
  };
  
  const getRoleName = (roleId) => roleMap[roleId] || "user";
  
  const getRoleId = (roleName) => {
    const roleId = Object.keys(roleMap).find(
      (key) => roleMap[key].toLowerCase() === roleName.toLowerCase()
    );
    return roleId ? parseInt(roleId) : 3;
  };

  module.exports = { roleMap, getRoleName, getRoleId };
  