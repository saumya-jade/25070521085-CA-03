const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role });

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    checkValidation(req, res);
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409);
      throw new Error("An account with this email already exists");
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, token: signToken(user._id), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    checkValidation(req, res);
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({ success: true, token: signToken(user._id), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
};

module.exports = { register, login, getMe };