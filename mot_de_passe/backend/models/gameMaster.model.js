const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const gameMasterSchema = mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 25,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlenth: 3,
            maxlength: 50,
            trim: true,
        },
        role: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

gameMasterSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

gameMasterSchema.statics.login = async function (pseudo, password) {
    
    const gameMaster = await this.findOne({ pseudo });
    // const gameMasters = await GameMasterModel.find();
    console.log(gameMaster);
    if (gameMaster) {
        console.log(gameMaster.password);
        console.log(password);
        const auth = await bcrypt.compare(password, gameMaster.password);
        console.log(auth);
        if (auth) {
            console.log('her2');
            return gameMaster;
        }
    }
    throw Error("accée refusé");
};

const GameMasterModel = mongoose.model("gamemaster", gameMasterSchema);

module.exports = GameMasterModel;