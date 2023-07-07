const express = require("express");
const router = express.Router();
const login = require("../controllers/player.controller");
const requireAuthPlayers = require("../middleware/auth.middleware")

// router.post("/login", login.signIn);
router.post("/register", login.signUp);
router.get("/all",  login.getallplayer)
router.post("/deleteplayer",  login.deletePlayer)

module.exports = router;