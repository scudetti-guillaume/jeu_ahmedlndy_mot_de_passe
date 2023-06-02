const express = require("express");
const router = express.Router();
const login = require("../controllers/player.controller");

// router.post("/login", login.signIn);
router.post("/register", login.signUp);

module.exports = router;