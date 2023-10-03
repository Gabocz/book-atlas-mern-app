const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const getUserFromToken = async (authHeader) => {
  const token = authHeader.split(" ")[1];
  // verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // get user from token
  const user = await User.findById(decoded.userId).select("-password");
  return user;
};

module.exports = getUserFromToken;
