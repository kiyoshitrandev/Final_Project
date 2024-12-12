const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/", cartController.getCartItems);
router.post("/", cartController.addCartItem);
router.put("/:id", cartController.updateCartItem);
router.delete("/:id", cartController.deleteCartItem);

module.exports = router;
