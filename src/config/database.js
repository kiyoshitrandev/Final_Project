const mysql = require("mysql2");

// Tạo pool kết nối MySQL với cơ sở dữ liệu "fashion"
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin123",
    database: "fashion",
    waitForConnections: true,
    connectionLimit: 10, // Giới hạn số kết nối đồng thời
    queueLimit: 0, // Không giới hạn hàng đợi kết nối
});

// Kiểm tra kết nối
db.getConnection((err, connection) => {
    if (err) {
        console.error("Lỗi kết nối MySQL:", err);
    } else {
        console.log("Kết nối MySQL thành công!");
        connection.release(); // Giải phóng kết nối sau khi kiểm tra
    }
});

module.exports = db;
