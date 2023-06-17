const EndGame = require("../models/summaryGame.model");
const TeamModel = require("../models/team.model");
const PlayerModel = require("../models/players.model");

exports.endgame = async (req, res) => {

    try {
        const dataEndGame = await TeamModel.find({});
        await EndGame.insertMany(dataEndGame).
        then((doc) => {
            req.app.get("io").emit("endgame", doc);
        })
        await TeamModel.deleteMany();
        await PlayerModel.updateMany({ selected: true }, { selected: false, Number: 0 });
        res.status(200).json({ message: "Mise à jour effectuée avec succès." });

    } catch (error) {
        res.status(400).json({ message: "Une erreur s'est produite lors de la mise à jour des données.", error });
    }
}

exports.getdata = async (req, res) => {
    try {
        const Data = await EndGame.find({});
        // console.log(Data);
        // await req.app.get("io").emit("startGame", Data);
        res.status(200).json(Data)

    } catch (err) {
        res.status(400).json(err)
        // 
    }

}
