const express = require("express");
const router = express.Router();
const team = require("../controllers/team.controller");
const io = require('socket.io')();


router.post("/addplayer", (req, res) => {
    // const io = getIO();
    // Utilisez l'instance de Socket.IO pour émettre ou écouter des événements Socket.IO
    io.emit('playerAdded', req.body); // Exemple d'émission d'un événement 'playerAdded'

    // Appelez la fonction de votre contrôleur pour ajouter un joueur
    team.addPlayer(req, res);
});

router.patch("/removeplayer", (req, res) => {
    // const io = getIO(); // Get the 'io' instance from the server
    io.emit("playerRemoved", req.body); // Emit a 'playerRemoved' event to all connected clients

    // Call your controller function to remove a player
    team.removePlayer(req, res);
});

router.get("/launchgame", (req, res) => {
    // const io = getIO(); // Get the 'io' instance from the server
    io.emit("startgame", req.body); // Emit a 'playerRemoved' event to all connected clients

    // Call your controller function to remove a player
    team.startGame(req, res);
});



module.exports = { router, io };