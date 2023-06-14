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
                        default: 0
                    },
                    wordlist: [
                        {
                            word: {
                                type: String,
                                required: true
                            },
                            status: {
                                type: String,
                                enum: [0, 1, 2],
                                default: 0
                            }
                        }

                    ],
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
            default: null
        },
        currentPlayerNumber: {
            type: Number,
            default: 0
        },
        currentPlayerWordList: {
            type: Number,
            default: 1
        },
        currentWordIndex: {
            type: Number,
            default: 0
        },
        currentAttempt: {
            type: Number,
            default: 1
        },
        chrono: {
            type: Number,
            default: 30
        }

    },

    {
        timestamps: true,
    }
);



const TeamModel = mongoose.model("team", teamSchema);
module.exports = TeamModel;