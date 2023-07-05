const express = require("express");
const router = express.Router();
const endGame = require("../controllers/summaryGame.controller");


router.post("/endGame", (req, res) => {
    endGame.endgame(req, res);
});

router.get("/getData", (req, res) => {
    endGame.getdata(req, res);
});

router.post("/deletegame", (req, res) => {
    endGame.deletegame(req, res);
});



module.exports = router;