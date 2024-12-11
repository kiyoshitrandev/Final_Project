const express = require("express");
const router = express.Router();
const {
    getCartItems,
    addCartItem,
    updateCartItem,
    deleteCartItem,
} = require("../controllers/cartController");

router.get("/", getCartItems);
router.post("/", addCartItem);
router.put("/", updateCartItem);
router.delete("/", deleteCartItem);

module.exports = router;
