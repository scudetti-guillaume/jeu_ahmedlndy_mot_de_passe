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
            type: Number,
            default : 0
        },
        rounds : {
        type : Number,
        default : 1
        },
        currentWord : {
        type : String
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