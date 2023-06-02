const PlayerModel = require("../models/players.model");
const jwt = require("jsonwebtoken");

const durationTokenLogin12 = 1 * 12 * 60 * 60 * 1000;
const durationTokenLogout = 1;

const createToken = (pseudo) => {
    console.log(pseudo);
    return jwt.sign({ pseudo }, process.env.TOKEN_SECRET, {
        expiresIn: "12h", // securité sur la durée du token (journée de travail) //
    });
};

exports.signUp = async (req, res, next) => {
    const { pseudo } = req.body;
    const find = await PlayerModel.findOne({pseudo : pseudo}).count();
    console.log(find);
    if (find != 0) {
        return res.status(401).json({ error: "pseudo déjà pris", });
    } else {
        try {
            const userNew = new PlayerModel({
                pseudo: pseudo,
                role: "player"
            });
            await userNew.save();
            const user = await PlayerModel.login(pseudo);
            console.log(user);
            const token = createToken(user._id);
            // return res.status(201).json(userNew);
            res.cookie("jwtPlayer", token, {
                session: false,
                maxAge: durationTokenLogin12,
                secure: false,
                httpOnly: true,
            });
            res.status(200).json({ user: user._id, token });
        } catch (err) {
        console.log(err);
            res.status(401).json('erreur veuillez reesayer');
        }
    }
};

// exports.signIn = async (req, res) => {
//     const { pseudo } = req.body;
//     console.log(req.body);
//     try {
//         const user = await PlayerModel.login(pseudo);
//         console.log(user);
//         const token = createToken(user._id);
//         // const cookieOptions = {
//         //     // SameSite: None, // Décommentez cette ligne si vous souhaitez activer SameSite=None pour les cookies (nécessite HTTPS)
//         //     // session: false, // Vous n'avez pas besoin de définir cette option car elle est obsolète dans Express
//         //     maxAge: durationTokenLogin12,
//         //     secure: false, // Définissez cette option sur true si vous utilisez HTTPS
//         //     httpOnly: true,
//         // };
//         res.cookie("jwtGamemaster", token, {
//             session: false,
//             maxAge: durationTokenLogin12,
//             secure: false,
//             httpOnly: true,
//         });
//         PlayerModel.findOne({ _id: user, role: "gameMaster" }, (err, doc) => {
//             if (doc) {
//                 console.log(res);
//                 res.status(200).json({ user: user._id, token });
//                 // res.clearCookie("jwtGamemaster"); 
//                 // res.status(400).json("utilisateur banni");
//             } else {
//                 res.cookie("jwtGamemaster", "", { maxAge: durationTokenLogout }),
//                     res.status(400).json("utilisateur banni");
//             }
//         });
//     } catch (error) {
//         console.log('error');
//         res.status(401).json('erreur veuillez reesayer');
//     }
// };

// logout end point \\

exports.logout = (req, res) => {
    res.cookie("jwtPlayer", "", { maxAge: durationTokenLogout });
    res.redirect("./");
};
