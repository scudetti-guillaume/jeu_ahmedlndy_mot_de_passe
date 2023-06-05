const mongoose = require("mongoose");

const playerSchema = mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
            trim: true,
        },
        role: {
            type: String,
        },
        selected : {
         type : Boolean,
         default : false
        }
        
    },
    {
        timestamps: true,
    }
)


playerSchema.statics.login = async function (pseudo) {
    const player = await this.findOne({ pseudo });
    // const gameMasters = await GameMasterModel.find();
    console.log(player);
    if (player) {
        return player;
    }
    throw Error("accée refusé");
};

const PlayerModel = mongoose.model("players", playerSchema);

module.exports = PlayerModel;