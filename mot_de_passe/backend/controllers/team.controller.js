const TeamModel = require("../models/team.model");
const PlayerModel = require("../models/players.model");
const jwt = require("jsonwebtoken");

exports.addPlayer = async (req, res) => {
    const { playerId } = req.body
    try {
        const addPlayer = await TeamModel.findOneAndUpdate({}, { $push: { playerId } }, { upsert: true, });
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
        res.status(200).json(PlayerListTrue)

    } catch (err) {
        res.status(400).json(err)
// 
    }
}

exports.startGame = async (req, res) => {
    const PlayerListTrue = await PlayerModel.find({ selected: true });
    console.log(PlayerListTrue);
    const teamStart = []
    teamStart.push(PlayerListTrue)
    try {
        PlayerListTrue.forEach((player) => {
            TeamModel.findOneAndUpdate(
                {},
                {
                    $push: { player: { playerId: player._id, playerPseudo: player.pseudo } }
                },
                { upsert: true, new: true }
            )
                .then((team) => {
                    console.log(team.id)
                    team.save()
                })

        });
        await res.status(200).json(teamStart)
        await req.app.get("io").emit("startGame", teamStart);
    } catch (error) {
        res.status(500).json('erreur de chargement de team');
    }
}

exports.wordList = async (req, res) => {
    const { player1Words, player2Words } = req.body;
    const list_1 = []
    const list_2 = []
    const askwordlist = await TeamModel.find({});
    askwordlist.forEach(team => {
        list_1.push(team.wordlist_1)
        list_2.push(team.wordlist_2)
        // console.log(team.wordlist_1);
        // console.log(team.wordlist_2);
    });

    console.log(list_1[0].length);
    console.log(list_2[0].length);

    if (list_1[0].length == 0 && list_2[0].length == 0 ){

    try {
        const updateQuery = {
            $push: {
                wordlist_1: { $each: player1Words },
                wordlist_2: { $each: player2Words }
            }
        };

        const wordlist = await TeamModel.updateMany({}, updateQuery);

        res.status(200).json("Mots ajoutés avec succès !" + wordlist);
    } catch (err) {
        res.status(400).json(err);
    }
    }else{
        res.status(200).json("Mots deja ajoutés avec succès !");
    }
}
