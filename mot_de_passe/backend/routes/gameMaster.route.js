const express = require("express");
const router = express.Router();
const login = require("../controllers/gmAuth.controller");
const { requireAuthGameMaster } = require("../middleware/auth.middleware");

router.post("/login", login.signIn);
router.post("/register", login.signUp);
router.post("/gamemaster", requireAuthGameMaster, login.getGamemaster)
router.post("/manageGame", requireAuthGameMaster, login.manageGame)
router.get("/getGameSettings", login.gameSettings)

module.exports = router;