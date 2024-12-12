const db = require("../config/database");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const path = require("path");

// User registration
exports.registerUser = (req, res) => {
    const { username, email, password } = req.body;

    // Check if email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred!" });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Encrypt password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Password encryption failed!" });
            }

            // Save the user to the database
            db.query(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                [username, email, hashedPassword],
                (err, results) => {
                    if (err) {
                        return res
                            .status(500)
                            .json({ message: "Error saving user!" });
                    }

                    // Send success response
                    return res
                        .status(201)
                        .json({ message: "Registration successful!" });
                }
            );
        });
    });
};

// User login
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists in the database
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred!" });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Email does not exist!" });
        }

        const user = results[0];

        // Check password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Password comparison error!" });
            }

            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect password!" });
            }
            // If the user is an admin, return the admin page URL
            if (email === "admin@gmail.com" && password === "admin") {
                return res.json({
                    redirectUrl: "http://localhost:3000/Admin/html/admin.html",
                });
            } else {
                // If the user is a regular user, return the homepage URL
                return res.json({
                    redirectUrl: "http://localhost:3000/Home/Index-AL.html",
                });
            }
        });
    });
};
