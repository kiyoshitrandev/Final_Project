const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin123",
    database: "fashion",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Lỗi kết nối MySQL:", err);
    } else {
        console.log("Kết nối MySQL thành công!");
        connection.release();
    }
});

module.exports = db;
