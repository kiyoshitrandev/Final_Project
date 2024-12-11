// usersRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

// Đăng ký người dùng
router.post("/register", registerUser);

// Đăng nhập người dùng
router.post("/login", loginUser);

module.exports = router;
