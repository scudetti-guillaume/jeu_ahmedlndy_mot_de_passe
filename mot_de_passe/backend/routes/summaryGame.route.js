const express = require("express");
const router = express.Router();
const endGame = require("../controllers/summaryGame.controller");


router.get("/endGame", (req, res) => {
    endGame.endgame(req, res);
});

router.get("/getData", (req, res) => {
    endGame.getdata(req, res);
});




module.exports = router;