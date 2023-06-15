const TeamModel = require("../models/team.model");
const PlayerModel = require("../models/players.model");
const jwt = require("jsonwebtoken");

exports.addPlayer = async (req, res) => {
    const { playerId, playerNumber } = req.body
    console.log(req.body);
    try {
        // const addPlayer = await TeamModel.findOneAndUpdate({}, { $push: { playerId } }, { upsert: true, });
        const PlayerListTrue = await PlayerModel.findOneAndUpdate({ _id: playerId }, { selected: true, Number: playerNumber }, { new: true });
        console.log(PlayerListTrue);
        if (PlayerListTrue) {
            req.app.get("io").emit("playerAdded", playerId);
            res.status(200).json(PlayerListTrue);
        }
    } catch (error) {
        res.status(400).json("erreur d'ajout de joueur")
    }
}

exports.removePlayer = async (req, res, next) => {
    const { playerId } = req.body
    try {
        // const removedPlayer = await TeamModel.findOneAndUpdate({}, { $pull: { playerId } }, { upsert: true, },);
        const PlayerListFalse = await PlayerModel.findOneAndUpdate({ _id: playerId }, { selected: false, Number: 0 }, { new: true });
        if (PlayerListFalse) {
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
        const playerList = await PlayerModel.find({ selected: true })
        res.status(200).json(playerList);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.startGame = async (req, res) => {
    const PlayerListTrue = await PlayerModel.find({ selected: true }).sort({ Number: 1 }).exec();
    
    // console.log(PlayerListTrue);
    const teamStart = []
    teamStart.push(PlayerListTrue)
    try {
        PlayerListTrue.forEach((player) => {
            TeamModel.findOneAndUpdate(
                {},
                {
                    $push: { players: { playerId: player._id, playerPseudo: player.pseudo, playerNumber: player.Number } }
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
    // console.log(req.body);
    const list_1 = []
    const list_2 = []
    const askwordlist = await TeamModel.find({});
    askwordlist.forEach(team => {
        team.players.forEach(player => {
            list_1.push(player.wordlist)
            list_2.push(player.wordlist)
        })
    });
    if (list_1[0].length == 0 && list_2[0].length == 0) {
        try {
            const updateQuery = {
                $push: {
                    "players.$[elem1].wordlist": { $each: player1Words },
                    "players.$[elem2].wordlist": { $each: player2Words }
                }
            };
            const options = {
                arrayFilters: [
                    { "elem1.playerNumber": 1 },
                    { "elem2.playerNumber": 2 }
                ]
            };
            await TeamModel.updateMany({}, updateQuery, options);
            res.status(200).json({ list_1: player1Words, list_2: player2Words });
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        console.log('la');
        res.status(200).json({ list_1, list_2 });
    }
}

exports.getData = async (req,res) => {
    try {
        const PlayerList = await TeamModel.find({});
        console.log(PlayerList);
        res.status(200).json(PlayerList)

    } catch (err) {
        res.status(400).json(err)
        // 
    }

}

exports.regenList = async (req, res) => {
    
    try {
        const updateQuery = {
            $unset: {
                "players.$[elem1].wordlist": 1,
                "players.$[elem2].wordlist": 1
            }
        };
        const options = {
            arrayFilters: [
                { "elem1.playerNumber": 1 },
                { "elem2.playerNumber": 2 }
            ]
        };
        await TeamModel.updateMany({}, updateQuery, options);
        res.status(200).json({ message: "Wordlists removed successfully." });
    } catch (err) {
        res.status(400).json(err);
    }
};


exports.update = async (req, res) => {
console.log(req.body);

    try {
        // Supprimer tous les documents de la collection
        await TeamModel.deleteMany();

        // Récupérer les nouvelles données à insérer
        const newGameData = req.body.gameData;

        // Insérer les nouvelles données dans la collection
        await TeamModel.insertMany(newGameData).then((doc)=>{
            req.app.get("io").emit("update", doc);
        
        })
        res.status(200).json({ message: "Mise à jour effectuée avec succès." });
        
    } catch (error) {
        res.status(400).json({ message: "Une erreur s'est produite lors de la mise à jour des données.", error });
    }

}

exports.chrono = async (req, res) => {
console.log(req.body.chrono);
    const chrono = req.body.chrono;
    try {
        await TeamModel.updateOne({chrono});
        console.log(chrono);
        res.status(200).json(chrono)
        req.app.get("io").emit("chrono", chrono);
    } catch (err) {
        res.status(400).json(err)
        // 
    }

}