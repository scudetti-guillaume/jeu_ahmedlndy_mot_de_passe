const mongoose = require("mongoose");

const teamSchema = mongoose.Schema(
    {
        playerId: [{
            type: String,
            required: true,
        }],
    },

    {
        timestamps: true,
    }
);

const TeamModel = mongoose.model("team", teamSchema);
module.exports = TeamModel;