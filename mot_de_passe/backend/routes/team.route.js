const express = require("express");
const router = express.Router();
const team = require("../controllers/team.controller");
// const { getIO } = require('../util/socket');
// const io = getIO();

router.post("/addplayer", (req, res) => {
    team.addPlayer(req, res);
});

router.patch("/removeplayer", (req, res) => {
    // req.app.get("io").emit("playerRemoved", req.body);
    team.removePlayer(req, res);
});

router.get("/team", (req, res) => {
    // req.app.get("io").emit("team", req.body);
    team.getTeam(req, res);
})

router.post("/launchgame", (req, res) => {
    // req.app.get("io").emit("startgame", res.body);
    team.startGame(req, res);
});

router.post("/words", (req, res) => {
    // req.app.get("io").emit("startgame", res.body);
    team.wordList(req, res);
});



module.exports = router;





