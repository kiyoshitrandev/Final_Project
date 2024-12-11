// Example Express Routes
const express = require("express");
const router = express.Router();

// Example route to get product details
router.get("/api/products/:id", (req, res) => {
    const productId = req.params.id;
    // Query your database to get the product by ID
    res.json({
        name: "Product Name",
        image: "/path/to/image.jpg",
        description: "Product Description",
        price: 100,
    });
});

// Example route to add product to cart
router.post("/api/cart", (req, res) => {
    const { productId, quantity } = req.body;
    // Add product to cart logic here
    res.json({ message: "Product added to cart" });
});

module.exports = router;
