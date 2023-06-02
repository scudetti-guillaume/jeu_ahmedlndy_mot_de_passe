const jwt = require("jsonwebtoken");
const PlayerModel = require("../models/players.model");
const ObjectID = require("mongoose").Types.ObjectId;

const durationTokenLogout = 1;

exports.requireAuthPlayer = (req, res, next) => {
    // const auth = req.headers.cookie;
    // const token = auth && auth.split("=")[1];
    const token = req.cookies.jwt;
    // console.log(auth);
    // console.log(token);
    // console.log(req.cookies.jwt);

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.status(401).send("token not found");
            } else {
                PlayerModel.findOne({ _id: decodedToken.id }, (err, doc) => {
                    if (doc) {
                        res.cookie("jwt", "", { maxAge: durationTokenLogout }),
                            res.status(400).json("utilisateur banni");
                    } else {
                        PlayerModel.find({ _id: decodedToken.id, role: player}, (err, doc) => {
                            if (doc ) {
                                req.role = "player"
                                req.user = decodedToken.id;
                                next()
                            } else {
                                req.user = decodedToken.id;
                                next();
                            }
                        })
                    }
                });
            }
        });
    } else {
        req.role = ""
        req.user = "";
        console.log("access denied invalid token ");
        next();
    }
};
