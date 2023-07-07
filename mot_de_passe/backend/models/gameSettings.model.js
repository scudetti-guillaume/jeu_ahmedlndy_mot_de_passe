const mongoose = require("mongoose");

const gameSettings = mongoose.Schema(
    {
        wordsNumber : {
        type : Number,  
        },
        chrono: {
            type: Number,
        },   
    },

    {
        timestamps: true,
    }
);


const GameSettings = mongoose.model("gamesettings", gameSettings);
module.exports = GameSettings;