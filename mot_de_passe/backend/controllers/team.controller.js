const TeamModel = require("../models/team.model");
const jwt = require("jsonwebtoken");

exports.addPlayer = async (req, res, next) => {
    const { playerId } = req.body
    try {
        // const findplayer = await PlayerModel.findById(playerId)
        // if (findplayer) {
        // const team = await TeamModel.find().count();
        // console.log(team);
        // if (team != 1) {
        //     team = new TeamModel();
        //     team.save();
        // }
        // const newPlayer = {
        //     playerId ,
        //     // playerPseudo: req.body.pseudo, 
        //     // playerRole : req.boby.role,
        //     // playerSelect 
        // } 

        TeamModel.findOneAndUpdate({}, { $push: { playerId } }, { upsert: true, }, (err, response) => {
            console.log(response);
            if (err) {
                res.status(400).json("erreur d'ajout de joueur");
            } else {
                res.status(200).json({ playerId });
                console.log('Joueur ajouté à l\'équipe:', playerId);

            }
        });
    } catch (error) {
        res.status(400).json("erreur d'ajout de joueur")
    }
    const find = await TeamModel.find().count();
    if (find > 2) {
        res.status(400).json("equipe complete")
    }

}

exports.removePlayer = async (req, res, next) => {
    console.log(req.body);
    const { playerId } = req.body
    try {
        const removedPlayer = await TeamModel.findOneAndUpdate({}, { $pull: { playerId } }, { upsert: true, },);
        if (removedPlayer) {
            // console.log('Joueur supprimé:', removedPlayer);
            res.status(200).json('Joueur supprimé');
        } else {
            res.status(400).json("Erreur de suppression du joueur");
        }
    } catch (error) {
        res.status(400).json("Erreur de suppression du joueur");
    }
}


exports.startGame = async (req, res) => {
    // const { playerId } = req.body
    const team = await TeamModel.find({}, 'playerId')
    console.log(team);
    if (team) {
        res.status(200).json(team)
    } else {
        res.status(400).json("erreur pas de session de jeu trouvée")
    }
}