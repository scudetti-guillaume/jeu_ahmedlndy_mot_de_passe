const express = require("express");
const router = express.Router();
const login = require("../controllers/gmAuth.controller");

router.post("/login", login.signIn);
router.post("/register", login.signUp);
router.get("/gamemaster", login.getGamemaster)

module.exports = router;