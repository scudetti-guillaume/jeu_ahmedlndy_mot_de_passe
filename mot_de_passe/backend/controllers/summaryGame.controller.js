// const EndGame = require("../models/summaryGame.model");
// const TeamModel = require("../models/team.model");
// const PlayerModel = require("../models/players.model");

// exports.endgame = async (req, res) => {

//     try {
//         const dataEndGame = await TeamModel.find({});
//         await EndGame.insertMany(dataEndGame)
//         await PlayerModel.updateMany({ selected: true }, { selected: false, Number: 0 });
//         await TeamModel.updateOne({ finish: true });
//         req.app.get("io").emit("endgame", dataEndGame);     
//         // await TeamModel.deleteMany();
//         // supression de tout les joueurs + retour à l'accueil 
//         // await PlayerModel.deleteMany();
//         // await PlayerModel.updateMany({ selected: true }, { selected: false, Number: 0 });
//         res.status(200).json({ message: "Mise à jour effectuée avec succès." });

//     } catch (error) {
//         res.status(400).json({ message: "Une erreur s'est produite lors de la mise à jour des données.", error });
//     }
// }




// exports.deletegame = async (req, res) => {
//     try {
//         await TeamModel.deleteMany();
//         // supression de tout les joueurs + retour à l'accueil 
//         // await PlayerModel.deleteMany();
//         await PlayerModel.updateMany({ selected: true }, { selected: false, Number: 0 });
//         res.status(200).json({ message: "Mise à jour effectuée avec succès." });
//     } catch (error) {
//         res.status(400).json({ message: "Une erreur s'est produite lors de la mise à jour des données.", error });
//     }
// }


// exports.getdata = async (req, res) => {
//     try {
//         const data = await EndGame.find({}).sort({ createdAt: -1 }).limit(1);
//         console.log(data);
//         res.status(200).json(data);
//     } catch (err) {
//         res.status(400).json(err);
//     }
// }


// exports.getdata = async (req, res) => {
//     try {
//         const Data = await EndGame.find({});
//         // console.log(Data);
//         // await req.app.get("io").emit("startGame", Data);
//         res.status(200).json(Data)

//     } catch (err) {
//         res.status(400).json(err)
//         // 
//     }

// }