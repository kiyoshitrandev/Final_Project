let cart = [];

exports.getCartItems = (req, res) => {
    console.log("Giỏ hàng hiện tại:", cart);
    res.json(cart);
};

exports.addCartItem = (req, res) => {
    const { id, name, price, image, size, quantity } = req.body;
    const existingItem = cart.find(
        (item) =>
            item.id === id &&
            item.name === name &&
            item.image === image &&
            item.size === size
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id, name, price, image, size, quantity });
    }

    console.log("Giỏ hàng hiện tại:", cart);
    res.status(201).json({ message: "Sản phẩm đã được thêm vào giỏ", cart });
};

exports.updateCartItem = (req, res) => {
    const { id } = req.params;
    const { size, delta } = req.body;

    const item = cart.find((item) => item.id === id && item.size === size);

    if (!item) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    item.quantity = Math.max(1, item.quantity + delta);

    res.json({ message: "Cập nhật thành công", cart });
};

exports.deleteCartItem = (req, res) => {
    const { id } = req.params;
    const { size } = req.query;

    console.log("Xóa sản phẩm:", { id, size });

    cart = cart.filter((item) => !(item.id === id && item.size === size));

    console.log("Giỏ hàng sau khi xóa:", cart);
    res.json({ message: "Xóa sản phẩm thành công", cart });
};
