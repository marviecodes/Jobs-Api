const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const authMiddleware = asyncHandler(async (req, res, next) => {
  // check header
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Authentication error, no token provided!");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // save user to req.user object
    req.user = { userId: decoded.userId, name: decoded.name };

    // another way
    // const user = User.findById(decoded.userId).select("-password");
    // req.user = user;
    next();
  } catch (error) {
    throw new Error("Invalid token provided!");
  }
});

module.exports = authMiddleware;
