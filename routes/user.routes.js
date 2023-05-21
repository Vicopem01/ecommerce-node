const express = require("express");
const { userSignUp, userLogin, userProfile, userUpdate } = require("../controllers/user.controller");
const router = express.Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.get("/profile", userProfile);
router.put("/update", userUpdate);

module.exports = router;