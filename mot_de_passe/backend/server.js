const express = require('express');

const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require("path")
const mongoose = require("mongoose");
const gameMasterRoutes = require("./routes/gameMaster.route");
const playerRoutes = require("./routes/players.route");
// const { requireAuth } = require("./middleware/auth.middleware");
require("dotenv").config({ path: "../.env" });
const app = express();
const corsOptions = {
    Origin: '*',
    origin: process.env.CLIENT_URL,
    credentials: true,
    // allowedHeaders: ["set-cookie", "Content-type"],
    allowedHeaders: ["*", "Content-type"],
    exposeHeaders: ["*"],
    // exposeHeaders:["set-cookie"] ,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

mongoose
    .connect(
        process.env.DB_USER_MONGO +
        process.env.DB_USER_PASS +
        process.env.DB_USER_CLUSTER
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB", err));


// app.get('*', requireAuth, (req, res) => {
//     if (req.user === '') {
//         res.status(201).json(res.data = 'notoken')
//     } else {
//         res.status(200).send(res.locals.user._id)
//     }
// });

app.use("/player", playerRoutes);
app.use("/gamemaster", gameMasterRoutes);
// app.use("/gameOn", userRoutes);


app.listen(process.env.PORT, (port) =>
    console.log(`listening on port ${process.env.PORT}`)
);;