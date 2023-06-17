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

router.get("/dataGame", (req, res) => {
    // req.app.get("io").emit("startgame", res.body);
    team.getData(req, res);
});

router.patch("/regenwords", (req, res) => {
    // req.app.get("io").emit("startgame", res.body);
    team.regenList(req, res);
});

router.post("/update", (req, res) => {
    // req.app.get("io").emit("startgame", res.body);
    team.update(req, res);
});

router.post("/chrono", (req, res) => {
    // req.app.get("io").emit("startgame", res.body);
    team.chrono(req, res);
});

router.patch("/reset", (req, res) => {
    // req.app.get("io").emit("startgame", res.body);
    team.reset(req, res);
});

module.exports = router;





