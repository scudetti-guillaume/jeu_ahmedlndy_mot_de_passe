// const express = require("express");
// const router = express.Router();
// const login = require("../controllers/player.controller");
// const requireAuthPlayers = require("../middleware/auth.middleware")
// const io = require('../server'); 
const TeamModel = require("../models/team.model");
const GameSettingsModel = require("../models/gameSettings.model");
const PlayerModel = require("../models/players.model");

exports.registerPlayer = async (data, callback) => {
    try {
        const { pseudo } = data;
        const find = await PlayerModel.countDocuments({ pseudo: pseudo });

        if (find !== 0) {
            return callback({ success: false, error: "pseudo déjà pris" });
        } else {
            const userNew = new PlayerModel({
                pseudo: pseudo,
                role: "player"
            });
            await userNew.save();
            callback({ success: true, user: { _id: userNew._id, role: userNew.role, pseudo: userNew.pseudo } });
            
        }
    } catch (err) {
        console.log(err);
        return callback({ success: false, error: "erreur veuillez réessayer" });
    }
};



exports.getAllPlayer = async (callback) => {
    try {
        const users = await PlayerModel.find({ selected: false });
        callback({ success: true, data: users});
    } catch (err) {
        console.log(err);
        return callback({ success: false, error: "erreur veuillez réessayer" });
    }
};

exports.deletePlayer = async (data , callback) => {
    const {playerId } = data
    const user = await PlayerModel.findOneAndRemove({ _id: playerId })
    callback({ success: true, data:  user });
};


// exports.getallplayer = async ( req,res ) => {
//     const users = await PlayerModel.find({selected : false});
//     res.status(200).json(users);
// }







// router.post("/login", login.signIn);

// router.post("/register", login.signUp);
// router.get("/all", login.getallplayer)
// router.post("/deleteplayer", login.deletePlayer)

// module.exports = router;