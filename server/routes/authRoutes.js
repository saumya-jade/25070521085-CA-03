const express = require("express");
const { body } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

const emailRule = body("email").trim().toLowerCase().isEmail().withMessage("Enter a valid email");

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    emailRule,
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  register
);

router.post(
  "/login",
  [emailRule, body("password").notEmpty().withMessage("Password is required")],
  login
);

router.get("/me", protect, getMe);

module.exports = router;