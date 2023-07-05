const gameMasterModel = require("../models/gameMaster.model");
const GameSettingsModel = require("../models/gameSettings.model");
const teamModel = require("../models/team.model");

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
    const { pseudo, password } = req.body;
    const find = await gameMasterModel.find().count();
    console.log(find);
    if (find != 0) {
        return res
            .status(401)
            .json({
                error:
                    "echec veuillez réessayer, si le probleme persiste contacter un administrateur",
            });
    } else {
        try {
            const userNew = new gameMasterModel({
                pseudo: pseudo,
                password: password,
                role : "gameMaster"
            });
            await userNew.save();
            return res.status(201).json(userNew);
        } catch (err) {
            const errors = signUpErrors(err);
        }
    }
};

exports.signIn = async (req, res) => {
    const { pseudo, password, role } = req.body;
    try {
        const user = await gameMasterModel.login(pseudo, password, role);
        const token = createToken(user._id , user.role);
        res.cookie("jwtGamemaster", token, {
            session: false,
            maxAge: durationTokenLogin12,
            secure: false,
            httpOnly: true,
        });
        gameMasterModel.findOne({ _id: user, role: "gameMaster" }, (err, doc) => {
            if (doc) {
                res.status(200).json({ user: user._id, role: user.role, pseudo: user.pseudo, token });
             
            } else {
                res.cookie("jwtGamemaster", "", { maxAge: durationTokenLogout }),
                res.status(400).json("utilisateur banni");
            }
        });
    } catch (error) {
        console.log('error');
        res.status(401).json('erreur veuillez reesayer');
    }
};

// logout end point \\

exports.logout = (req, res) => {
    res.cookie("jwtGamemaster", "", { maxAge: durationTokenLogout });
    res.redirect("./");
};


exports.getGamemaster = async (req, res) => {
    const users = await gameMasterModel.find();
    res.status(200).json(users);
}

exports.gameSettings = async (req, res) => {
    const getData = await GameSettingsModel.find({})
    // console.log(getData);
    res.status(200).json(getData);
}

exports.manageGame = async (req, res) => {
console.log(req.body.data);
    const { chrono, wordsNumber } = req.body.data;
    const dataUpdate = await GameSettingsModel.updateMany({ chrono, wordsNumber })
    // GameSettingsModel.updateMany 
    res.status(200).json(dataUpdate);
}