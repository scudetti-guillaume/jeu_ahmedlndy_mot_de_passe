const express = require('express');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require("path");
const gameMasterRoutes = require("./routes/gameMaster.route");
const playerRoutes = require("./routes/players.route");
const { router, io } = require("./routes/team.route");
require("dotenv").config({ path: "../.env" });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
    Origin: '*',
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["*", "Content-type"],
    // allowedHeaders: ["set-cookie", "Content-type"],
    exposeHeaders: ["set-cookie"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
};

app.use(cors(corsOptions));
io.use(cors(corsOptions));
// io.origins('*:*');

mongoose
    .connect(
        process.env.DB_USER_MONGO +
        process.env.DB_USER_PASS +
        process.env.DB_USER_CLUSTER
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB", err));
    
app.use("/player", playerRoutes);
app.use("/gamemaster", gameMasterRoutes);
app.use("/team", router);


const server = app.listen(process.env.PORT, () =>
    console.log(`listening on port ${process.env.PORT}`)
);

io.attach(server);


