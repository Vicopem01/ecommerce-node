const express = require("express");
const {  addProductToCart, removeProductFromCart } = require("../controllers/cart.controller");
const isAuthenticated = require("../middleware/auth");
const router = express.Router();



router.post("/", isAuthenticated, addProductToCart);
router.delete("/", isAuthenticated, removeProductFromCart);


module.exports = router;
