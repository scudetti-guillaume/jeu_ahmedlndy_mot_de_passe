const jwt = require("jsonwebtoken");
const gameMasterModel = require("../models/gameMaster.model");

const durationTokenLogout = 1;

exports.requireAuthGameMaster = (req, res, next) => {
    const token = req.body.token;
  
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            console.log(token);
            console.log(decodedToken);
            if (err) {
            console.log('la');
                res.status(401).send("token not found");
            } else {
            gameMasterModel.findOne({ _id: decodedToken.pseudo }, (err, doc) => {
                if (!doc) {
                
                    res.status(400).json("utilisateur banni");
                } else {
                    gameMasterModel.find({ _id: decodedToken.id, role: "gameMaster" }, (err, doc) => {
                        if (doc) {
                            req.role = "gameMaster";
                            req.user = decodedToken.id;
                            next();
                        } else {
                            res.status(400).json("utilisateur banni");
                        }
                    });
                }
            });
            }
        });
    } else {
        req.role = "";
        req.user = "";
        console.log("access denied invalid token ");
        // next();
    }
};
