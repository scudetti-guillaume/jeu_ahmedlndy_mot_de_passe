const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require('body-parser');
const path = require("path");
const gameMasterRoute = require("./routes/gameMaster.route");
const playerRoute = require("./routes/players.route");
const teamRoute  = require("./routes/team.route");
const gameRoute  = require("./routes/summaryGame.route");
require("dotenv").config({ path: ".env" });
const PlayerModel = require("./models/players.model");


const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    // path: `${process.env.BASE_URL}`,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
        credentials: true,
    },
    transports: ['websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling',
        'polling'],
    allowEIO3: true,
    serveClient: true,
});

    const corsOptions = {
    Origin: '*',
    origin: '*',
    credentials: true,
    allowedHeaders: ["*", "Content-type"],
    exposeHeaders: ["set-cookie"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {
    socket.on('register', async (data, callback) => { playerRoute.registerPlayer(data, (response) =>{
        callback(response);
        if (response.success) {
            io.emit('newPlayer'); // Envoie les informations du nouveau joueur aux clients
        }
    })});
    socket.on('playerDelete', async (data, callback) => {
        playerRoute.deletePlayer(data, (response) => {
            callback(response);
            if (response.success) {
                io.emit('playerDeleted'); // Envoie les informations du nouveau joueur aux clients
            }
        });
    });
    socket.on('allPlayer', async (callback) => { playerRoute.getAllPlayer(callback);});
    socket.on('getChrono', async (data, callback) => {
        teamRoute.getChrono(data, (response) => {
            callback(response);
            if (response.success) {
            console.log(data);
                io.emit('chrono', response.data); 
            }
        });
});
    socket.on('getTeam', async (callback) => { teamRoute.getTeam(callback);});
    socket.on('playerAdd', async (data, callback) => { teamRoute.addPlayer(data, (response) =>{
        callback(response);
        if (response.success) {
            io.emit('playerAdded', data); 
        }
    });});
    socket.on('playerRemove', async (data, callback) => {
        teamRoute.playerRemove(data, (response) => {
            callback(response);
            if (response.success) {
                io.emit('playerRemoved', data); 
            }
        });
    });
    socket.on('launchGame', async (callback) => {
        teamRoute.launchGame((response) => {
            callback(response);
            if (response.success) {
                io.emit('startGame', response.data); // Envoie les informations du nouveau joueur aux clients
            }
        });
    });
    
    socket.on('getWord', async (data,callback) => { teamRoute.getWord(data,callback)});
    socket.on('regenList', async (data,callback) => { teamRoute.regenList(data,(response)=>{
        callback(response);
        if (response.success) {
            io.emit('Game', response.data);
        }
    })});
    
    socket.on('getUpdate', async (data , callback) => { teamRoute.getUpdate(data ,(response)=>{
        callback(response);
        if (response.success) {
            io.emit('update'); 
        }
    })});
    
    socket.on('getDataGame', async(callback) => {
        teamRoute.getDataGame((response) => {
            callback(response);
            if (response.success) {
                io.emit('Game', response.data);
            }
        });
    });

    socket.on('teamReset', async(callback)=> {
        teamRoute.teamReset((response) => {
            callback(response);
            if (response.success) {
                io.emit("reset")
            }
        })
    });
    
  
    // socket.on('getGameSettings', async (callback) => { gameMasterRoute.getGameSettings(callback); });
    socket.on('registerGameMaster', async (data,callback) => { gameMasterRoute.registerGameMaster(data, callback); });
    socket.on('loginGameMaster', async (data,callback) => { gameMasterRoute.loginGameMaster(data, callback); });
    socket.on('getGameMaster', async (data,callback) => { gameMasterRoute.getGameMaster(data, callback); });
    socket.on('getGameSettings', async (callback) => { gameMasterRoute.getGameSettings(callback); });
    socket.on('getManageGame', async (data, callback) => { gameMasterRoute.getManageGame(data,callback); });
    socket.on('endGame', async (callback) => { gameRoute.endGame((response)=>{
        callback(response);
        if (response.success) {
            io.emit("endgame", dataEndGame)
        }
    }); });
    
    socket.on('getEndGameData', async (callback) => { gameRoute.getEndGameData(callback); });

});

const PORT = 4000
server.listen(PORT, (port) =>
    console.log(`connected ${PORT}` )
);

mongoose
    .connect(
        process.env.DB_USER_MONGO +
        process.env.DB_USER_PASS +
        process.env.DB_USER_CLUSTER
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB", err));



// const playerNamespace = io.of('/player');
// const gameMasterNamespace = io.of('/gamemaster');
// const teamNamespace = io.of('/team');
// const endGameNamespace = io.of('/endgame');

// playerNamespace.on('connection', (socket) => {
//     socket.on('register', async (data, callback) => {
//         playerRoute.registerPlayer(data, (response) => {
//             callback(response);
//             if (response.success) {
//                 playerNamespace.emit('newplayer'); // Envoie les informations du nouveau joueur aux clients
//             }
//         })
//     })
//     socket.on('allplayer', async (callback) => { playerRoute.getAllPlayer(callback); });
// });



// teamNamespace.on('connection', (socket) => {
//     socket.on('getteam', async (callback) => { teamRoute.getAllPlayer(callback); });
// });


// io.on('connection', (socket) => {
//     console.log('Un client est connecté.');

//     // Ecouter l'événement 'register' émis par le client
//     socket.on('register', async (data, callback) => {
//         try {
//             const { pseudo } = data;
//             const find = await PlayerModel.count({ pseudo: pseudo });

//             if (find !== 0) {
//                 return callback({ success: false, error: "pseudo déjà pris" });
//             } else {
//                 const userNew = new PlayerModel({
//                     pseudo: pseudo,
//                     role: "player"
//                 });
//                 await userNew.save();
//                 io.emit('newlogin', { user: userNew });
//                 return callback({ success: true, user: { _id: userNew._id, role: userNew.role, pseudo: userNew.pseudo } });
//             }
//         } catch (err) {
//             console.log(err);
//             return callback({ success: false, error: "erreur veuillez reesayer" });
//         }
//     })
// });

    
    

    
// app.set("io", io);


// app.io = io;



// gameMasterNamespace.on('connection', (socket) => {
//     // Gestion des événements spécifiques pour la route /gamemaster
//     gameMasterRoute(socket);
// });

// teamNamespace.on('connection', (socket) => {
//     // Gestion des événements spécifiques pour la route /gamemaster
//     teamRoute(socket);
// });

// endGameNamespace.on('connection', (socket) => {
//     // Gestion des événements spécifiques pour la route /gamemaster
//     gameRoute(socket);
// });


// app.use(`${process.env.BASE_URL}/player`, playerRoute);
// app.use(`${process.env.BASE_URL}/gamemaster`, gameMasterRoute);
// app.use(`${process.env.BASE_URL}/team`, teamRoute);
// app.use(`${process.env.BASE_URL}/endgame`, gameRoute);













