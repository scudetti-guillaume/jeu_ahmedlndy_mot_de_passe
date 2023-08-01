const express = require("express");
const router = express.Router();
const login = require("../controllers/gmAuth.controller");
const { requireAuthGameMaster } = require("../middleware/auth.middleware");
const gameMasterModel = require("../models/gameMaster.model");
const GameSettingsModel = require("../models/gameSettings.model");
const jwt = require("jsonwebtoken");
const durationTokenLogin12 = 1 * 12 * 60 * 60 * 1000;
const durationTokenLogout = 1;

const createToken = (id, role) => {
    return jwt.sign({ id , role }, process.env.TOKEN_SECRET, {
        expiresIn: "24h", // securité sur la durée du token (journée de travail) //
    });
};


exports.getGameSettings = async (callback) => {
    const getData = await GameSettingsModel.find({})
    callback({ success: true, data : getData })
}

exports.registerGameMaster = async (data, callback) => {
    const { pseudo, password } = data;
        try {
            const userNew = new gameMasterModel({
                pseudo: pseudo,
                password: password,
                role: "gameMaster"
            });
            await userNew.save();
            callback({ success: true, data: { user: userNew._id, role: userNew.role, pseudo: userNew.pseudo } })
        } catch (err) {
            callback({ success: false, error: err })
        }
};

exports.loginGameMaster = async (data, callback) => {
    const { pseudo, password, role } = data;
    try {
        const user = await gameMasterModel.login(pseudo, password, role);
        const token = createToken(user._id, user.role);
        gameMasterModel.findOne({ _id: user._id, role: "gameMaster" }, (err, doc) => {
            if (doc) {
                callback({ success: true, data: { user: user._id, role: user.role, pseudo: user.pseudo,  token : token} })
            } else {
                callback({ success: false, error: 'erreur de register gameMaster' })
            }
        });
    } catch (error) {
        callback({ success: false, error : error })
    }
};

exports.getGameMaster = (data, callback) => {
    const {token} = data;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err || !decodedToken) {
                callback({ success: true, data: 'not gamemaster' });
                return;
            }
            const gamemaster = await gameMasterModel.findOne({_id : decodedToken.id });
            if (!gamemaster) {
                callback({ success: true, data: 'not gamemaster' });
                return;
            }else{
                callback({ success: true, gamemaster });
            }

            // const isGameMaster = await gameMasterModel.exists({ _id: decodedToken.id, role: 'gameMaster' });
            // if (isGameMaster) {
            //     const user = await gameMasterModel.find({});
            //     console.log(user);
                
            // } else {
            //     callback({ success: true, data: 'not gamemaster' });
            // }
        });
    } else {
        callback({ success: true, data: 'not gamemaster' });
    }
};




exports.getManageGame = async (data, callback) => {
    const token = data.token;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err || !decodedToken) {
                callback({ success: false, data: 'not gamemaster' });
                return;
            }
            const { chrono, wordsNumber } = data.data;
            const dataUpdate = await GameSettingsModel.updateMany({ chrono, wordsNumber });
            callback({ success: true, data: dataUpdate });
        });
    } else {
        callback({ success: false, data: 'not gamemaster' });
    }
};

// router.post("/login", login.signIn);
// router.post("/register", login.signUp);
// router.post("/gamemaster", requireAuthGameMaster, login.getGamemaster)
// router.post("/manageGame", requireAuthGameMaster, login.manageGame)
// router.get("/getGameSettings", login.gameSettings)

// module.exports = router;