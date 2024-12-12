const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./routes/users");
const paymentRoutes = require("./routes/payment");
const cartRoutes = require("./routes/cart");
// const cors = require("cors");

// Khởi tạo ứng dụng Express
const app = express();
const port = process.env.PORT || 3001;
const hostname = process.env.HOST_NAME || "localhost";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// Middleware
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);

// Route chính
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/Home/Index.html"));
});

//Router product1 detail
app.get("/Home/product1-detail.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/Home/product1-detail.html"));
});

//Router admin page
app.get("/admin.html", (req, res) => {
    res.sendFile(__dirname + "/public/Admin/admin.html");
});

app.get("/Index-AL.html", (req, res) => {
    res.sendFile(__dirname + "/public/Home/Index-AL.html");
});

app.get("payment.html", (req, res) => {
    res.sendFile(__dirname + "/public/Home/payment.html");
});

// Khởi chạy server
app.listen(port, () => {
    console.log(`Server đang chạy tại: http://${hostname}:${port}`);
});

module.exports = app;
