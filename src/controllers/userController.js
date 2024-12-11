const db = require("../config/database");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const path = require("path");

// Đăng ký người dùng
exports.registerUser = (req, res) => {
    const { username, email, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Đã xảy ra lỗi!" });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: "Email đã tồn tại!" });
        }

        // Mã hóa mật khẩu
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Mã hóa mật khẩu không thành công!" });
            }

            // Lưu người dùng vào cơ sở dữ liệu
            db.query(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                [username, email, hashedPassword],
                (err, results) => {
                    if (err) {
                        return res
                            .status(500)
                            .json({ message: "Lỗi khi lưu người dùng!" });
                    }

                    // Gửi phản hồi thành công
                    return res
                        .status(201)
                        .json({ message: "Đăng ký thành công!" });
                }
            );
        });
    });
};

// Đăng nhập người dùng
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra xem người dùng có trong cơ sở dữ liệu không
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Đã xảy ra lỗi!" });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Email không tồn tại!" });
        }

        const user = results[0];

        // Kiểm tra mật khẩu
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Lỗi so sánh mật khẩu!" });
            }

            if (!isMatch) {
                return res.status(400).json({ message: "Mật khẩu sai!" });
            }
            // Nếu là admin, trả về URL của trang quản trị
            if (email === "admin@gmail.com" && password === "admin") {
                return res.json({
                    redirectUrl: "http://localhost:3000/Admin/admin.html",
                });
            } else {
                // Nếu là người dùng thông thường, trả về URL của trang chủ
                return res.json({
                    redirectUrl: "http://localhost:3000/Home/Index-AL.html",
                });
            }
        });
    });
};
