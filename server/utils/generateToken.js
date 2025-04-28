const jwt = require("jsonwebtoken");

// Token generation helper function
const generateToken = (email) => {
  const date = new Date();
  const token = jwt.sign({ email, date }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = generateToken;
