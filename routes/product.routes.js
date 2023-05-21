const express = require("express");
const router = express.Router();

const { createProduct, getAllProducts } = require("../controllers/product.controller");
const isAuthenticated = require("../middleware/auth");

router.post("/create",isAuthenticated, createProduct);
router.get("/all", getAllProducts);

module.exports = router;