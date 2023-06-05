const TeamModel = require("../models/team.model");
const PlayerModel = require("../models/players.model");
const jwt = require("jsonwebtoken");

exports.addPlayer = async (req, res) => {
    const { playerId } = req.body
    try {
      const addPlayer = await  TeamModel.findOneAndUpdate({}, { $push: { playerId } }, { upsert: true, });
        const PlayerListTrue = await PlayerModel.findOneAndUpdate({ _id: playerId }, { selected: true }, { new: true });
        console.log(PlayerListTrue);
        if (addPlayer && PlayerListTrue) {
            req.app.get("io").emit("playerAdded", playerId);
            res.status(200).json(addPlayer);
        }
    } catch (error) {
        res.status(400).json("erreur d'ajout de joueur")
    }
}

exports.removePlayer = async (req, res, next) => {
    const { playerId } = req.body
    try {
        const removedPlayer = await TeamModel.findOneAndUpdate({}, { $pull: { playerId } }, { upsert: true, },);
        const PlayerListFalse = await PlayerModel.findOneAndUpdate({ _id: playerId }, { selected: false }, { new: true });
        if (removedPlayer && PlayerListFalse) {
            req.app.get("io").emit("playerRemoved", playerId);
            res.status(200).json('Joueur supprimé' + '' + playerId);
        } else {
            res.status(400).json("Erreur de suppression du joueur");
        }
    } catch (error) {
        res.status(400).json("Erreur de suppression du joueur");
    }
}

exports.getTeam = async (req, res) => {
try {
    const PlayerListTrue = await PlayerModel.find({ selected: true });
    console.log(PlayerListTrue);
    // const team = await TeamModel.find({}, 'playerId')
    // selectedPlayers = []
    // if (team.length != 0) {
    //     const Players = team[0].playerId 
    //     // console.log(Players);
    //     console.log(Players);
    //     Players.forEach(player => {
    //         console.log(player);
    //         PlayerModel.findById( player, (res)=>{
            
    //             console.log(res);
            
    //         })
         
    //     });
    res.status(200).json(PlayerListTrue)
    // } else {
    //     res.status(200).json("aucun joueur selectionner")
    // }
}catch (err){
    res.status(400).json(err)

}
}

exports.startGame = async (req, res) => {
    const team = await TeamModel.find({}, 'playerId')
    if (team) {
        req.app.get("io").emit("startGame", team);
        res.status(200).json(team)
    } else {
        res.status(400).json("erreur pas de session de jeu trouvée")
    }
}