const EndGame = require("../models/summaryGame.model");
const TeamModel = require("../models/team.model");
const PlayerModel = require("../models/players.model");

exports.endGame = async (callback) => {

    try {
        const dataEndGame = await TeamModel.find({});
        await EndGame.insertMany(dataEndGame)
        await PlayerModel.deleteMany({})
        // await PlayerModel.updateMany({ selected: true }, { selected: false, Number: 0 });
        const dataToEmit = await TeamModel.updateOne({ finish: true });
        callback({ success: true, data: dataToEmit, message: "Mise à jour effectuée avec succès." })

    } catch (error) {
        callback({ success: false, message: error })
    }
}


exports.getEndGameData = async (callback) => {
    try {
        TeamModel.deleteMany({});
        const data = await EndGame.find({}).sort({ createdAt: -1 }).limit(1);
        callback({success:true, data : data})
    } catch (err) {
        callback({ success: false, data: err })
    }
}



// const express = require("express");
// const router = express.Router();
// const endGame = require("../controllers/summaryGame.controller");

// router.post("/endGame", (req, res) => {
//     endGame.endgame(req, res);
// });

// router.get("/getData", (req, res) => {
//     endGame.getdata(req, res);
// });

// router.post("/deletegame", (req, res) => {
//     endGame.deletegame(req, res);
// });



// module.exports = router;