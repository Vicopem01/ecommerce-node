const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/order.controller");
const isAuthenticated = require("../middleware/auth");

router.post("/",isAuthenticated, createOrder);

module.exports = router;
