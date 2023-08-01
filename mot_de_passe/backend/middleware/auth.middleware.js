const jwt = require("jsonwebtoken");
const gameMasterModel = require("../models/gameMaster.model");

const durationTokenLogout = 1;

exports.requireAuthGameMaster = (req, res, next) => {
    const token = req.body.token;
  
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            // console.log(token);
            // console.log(decodedToken);
            if (decodedToken === undefined) {
                req.role = "";
                req.user = "";
                next();
            } else {
            gameMasterModel.findOne({ _id: decodedToken.id }, (err, doc) => {
                if (!doc) {
                    req.role = "";
                    req.user = "";
                    next();
                } else {
                    gameMasterModel.find({ _id: decodedToken.id, role: "gameMaster" }, (err, doc) => {
                        if (doc) {
                            req.role = "gameMaster";
                            req.user = decodedToken.id;
                            next();
                        } else {
                            req.role = "";
                            req.user = "";
                            next();
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
        next();
    }
};
