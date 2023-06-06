const mongoose = require("mongoose");

const teamSchema = mongoose.Schema(
    {
        player: {
            type: [
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
                    speak: {
                        type: Boolean,
                        default: false
                    }
                }
            ]
        },
        points: {
            type: String,
            default : 0
        },
        wordlist_1: [String],
        wordlist_2: [String],
        
    },

{
    timestamps: true,
    }
);



const TeamModel = mongoose.model("team", teamSchema);
module.exports = TeamModel;