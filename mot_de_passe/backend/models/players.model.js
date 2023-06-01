const mongoose = require("mongoose");

const playerSchema = mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
)

const PlayerModel = mongoose.model("players", playerSchema);

module.exports = PlayerModel;