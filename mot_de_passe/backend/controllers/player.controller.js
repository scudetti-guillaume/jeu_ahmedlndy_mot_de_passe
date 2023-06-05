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
            const token = createToken(user._id);
            console.log(token);
            // return res.status(201).json(userNew);
            res.cookie("jwtPlayer", token, {
                session: false,
                maxAge: durationTokenLogin12,
                secure: false,
                httpOnly: true,
            });
            res.status(200).json({ user: user._id, role: user.role, pseudo: user.pseudo, token });
        } catch (err) {
        console.log(err);
            res.status(401).json('erreur veuillez reesayer');
        }
    }
};

exports.logout = (req, res) => {
    res.cookie("jwtPlayer", "", { maxAge: durationTokenLogout });
    res.redirect("./");
};


exports.getallplayer = async ( req,res ) => {
    const users = await PlayerModel.find({selected : false});
    res.status(200).json(users);
}