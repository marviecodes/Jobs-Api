const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const user = await User.create({ ...req.body });

  // Generate token
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, user: { name: user.name }, token });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please provide email and password");
  }

  // check if user exists in db
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials!");
  }

  // Check for password match
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid credentials!");
  }

  // Generate token
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res
    .status(StatusCodes.OK)
    .json({ success: true, user: { name: user.name }, token });
});

module.exports = { registerUser, loginUser };
