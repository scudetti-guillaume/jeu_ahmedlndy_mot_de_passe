const mongoose = require("mongoose");

const teamSchema = mongoose.Schema(
    {
        players:
            [
                {
                    playerId:
                    {
                        type: String,
                        require: true
                    },
                    playerPseudo: {
                        type: String,
                        require: true
                    },
                    playerNumber: {
                        type: Number,
                        default : 0
                    },
                    wordlist: [String],
                },

            ],

        points: {
            type: Number,
            default: 0
        },
        rounds: {
            type: Number,
            default: 1
        },
        currentWord: {
            type: String,
            default : null
        },
        currentWordIndex: {
            type: Number,
            default: 0
        },
 
    },

    {
        timestamps: true,
    }
);



const TeamModel = mongoose.model("team", teamSchema);
module.exports = TeamModel;