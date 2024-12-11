const db = require("../config/database"); // Đảm bảo đường dẫn đúng

// Lấy danh sách sản phẩm trong giỏ hàng
exports.getCartItems = (req, res) => {
    const userId = req.query.user_id || req.body.user_id; // Lấy user_id từ query hoặc body
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    db.query(
        "SELECT * FROM Cart WHERE user_id = ?",
        [userId],
        (err, results) => {
            if (err) {
                console.error("Lỗi khi truy vấn giỏ hàng:", err);
                return res.status(500).json({ message: "Lỗi server" });
            }
            res.json(results); // Trả về danh sách sản phẩm trong giỏ
        }
    );
};

// Thêm sản phẩm vào giỏ hàng
exports.addCartItem = (req, res) => {
    const { product_id, quantity, user_id } = req.body; // Lấy user_id từ body
    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
    const checkSql = "SELECT * FROM Cart WHERE user_id = ? AND product_id = ?";
    db.query(checkSql, [user_id, product_id], (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn kiểm tra giỏ hàng:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length > 0) {
            // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
            const updateSql =
                "UPDATE Cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?";
            db.query(
                updateSql,
                [quantity, user_id, product_id],
                (err, result) => {
                    if (err) {
                        console.error("Lỗi khi cập nhật giỏ hàng:", err);
                        return res
                            .status(500)
                            .json({ error: "Database error" });
                    }
                    res.status(200).json({
                        message: "Cart updated successfully",
                    });
                }
            );
        } else {
            // Nếu sản phẩm chưa có trong giỏ, thêm mới
            const insertSql =
                "INSERT INTO Cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
            db.query(
                insertSql,
                [user_id, product_id, quantity],
                (err, result) => {
                    if (err) {
                        console.error("Lỗi khi thêm sản phẩm vào giỏ:", err);
                        return res
                            .status(500)
                            .json({ error: "Database error" });
                    }
                    res.status(201).json({ message: "Product added to cart" });
                }
            );
        }
    });
};

// Cập nhật sản phẩm trong giỏ hàng
exports.updateCartItem = (req, res) => {
    const { product_id, quantity, user_id } = req.body; // Lấy user_id từ body

    if (!user_id || !product_id || quantity === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql =
        "UPDATE Cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
    db.query(sql, [quantity, user_id, product_id], (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật giỏ hàng:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found in cart" });
        }
        res.status(200).json({ message: "Cart updated successfully" });
    });
};

// Xóa sản phẩm khỏi giỏ hàng
exports.deleteCartItem = (req, res) => {
    const { product_id, user_id } = req.body; // Lấy user_id từ body

    if (!user_id || !product_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "DELETE FROM Cart WHERE user_id = ? AND product_id = ?";
    db.query(sql, [user_id, product_id], (err, result) => {
        if (err) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found in cart" });
        }
        res.status(200).json({ message: "Product removed from cart" });
    });
};
