// const PlayerModel = require("../models/players.model");
// const jwt = require("jsonwebtoken");


// const durationTokenLogin12 = 1 * 12 * 60 * 60 * 1000;
// const durationTokenLogout = 1;

// const createToken = (pseudo) => {
//     console.log(pseudo);
//     return jwt.sign({ pseudo }, process.env.TOKEN_SECRET, {
//         expiresIn: "12h", // securité sur la durée du token (journée de travail) //
//     });
// };

// exports.signUp = async (req, res, next) => {
//     console.log(req.body);
//     const { pseudo } = req.body;
//     const find = await PlayerModel.count({ pseudo: pseudo });
//     console.log(find);
//     if (find != 0) {
//         return res.status(401).json({ error: "pseudo déjà pris", });
//     } else {
//         try {
//             const userNew = new PlayerModel({
//                 pseudo: pseudo,
//                 role: "player"
//             });
//             await userNew.save();
//             res.status(200).json({ user: userNew._id, role: userNew.role, pseudo: userNew.pseudo })
//             req.app.io.emit('newlogin', { user });     
//         } catch (err) {
//             console.log(err);
//             res.status(401).json('erreur veuillez reesayer');
//         }
//     }
// };


// exports.deletePlayer = async (req, res) => {
//     const playerId  = req.body.playerId
//     console.log(playerId);
//     await PlayerModel.findOneAndRemove({ _id: playerId })
//     res.status(200).json('joueur delete')
// };




// exports.logout = (req, res) => {
//     res.cookie("jwtPlayer", "", { maxAge: durationTokenLogout });
//     res.redirect("./");
// };


// exports.getallplayer = async ( req,res ) => {
//     const users = await PlayerModel.find({selected : false});
//     res.status(200).json(users);
// }



