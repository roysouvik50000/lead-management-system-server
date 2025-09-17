const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

// Register → Only Admin can register users
router.post("/register", authMiddleware, authorizeRoles("Admin"), register);

// Login
router.post("/login", login);

module.exports = router;
