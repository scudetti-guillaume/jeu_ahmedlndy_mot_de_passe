import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig.js';
import { io } from 'socket.io-client';

const GamePlayers = () => {
    const [gameData, setGameData] = useState(null);
    const [round, setRound] = useState(1);
    const [teamScore, setTeamScore] = useState(0);
    const [countdown, setCountdown] = useState(30);
    const [playerId, setPlayerId] = useState(null)
    const [currentPlayer, setCurrentPlayer] = useState(1)
    
    useEffect(() => {
        const getDataGame = async () => {
            try {
                const player = localStorage.getItem('user')
                setPlayerId(player)
              const response = await axios.get("/team/dataGame")
                setGameData(response.data);
                setTeamScore(response.data[0].points);
                setRound(response.data[0].rounds)
                setCurrentPlayer(response.data[0].currentPlayerWordList)
               const first = response.data[0].players[0].wordlist[0].status 
               console.log(first);
                
            } catch (error) {
                console.log(error);
            }
        };
      
        
        const socket = io(`http://localhost:4000`);
        socket.on('startGame', (gameData) => {
            setGameData(gameData);
            setTeamScore(gameData.points);
            setRound(gameData.rounds);
            setCurrentPlayer(gameData.currentPlayerWordList);
           
        });
        
        
        socket.on('update', (gameData) => {
            console.log(gameData);
            setGameData(gameData);   
            setTeamScore(gameData.points);
            setRound(gameData.rounds)
            setCurrentPlayer(gameData.currentPlayerWordList)

        });
        
        socket.on('chrono', (countdown) => {
            console.log(countdown);
            setCountdown(countdown);
        });
        getDataGame();
        return () => {
            socket.disconnect();
        };
        
    }, []);

    useEffect(() => {
        setGameData(gameData);
        if (gameData) {
            setCurrentPlayer(gameData[0].currentPlayerWordList);
            setTeamScore(gameData[0].points);
            setRound(gameData[0].rounds);
        //    const firstWord = gameData[0].players[0].wordlist[0].status
        //     console.log(firstWord); 
        }
    }, [gameData]);

  

    return (
        <div className="GP-main">
            <div>
                <h1>hamed mot de passe</h1>
            </div>
            <div>
                <h2>
                    Manche <span>{round}</span>
                </h2>
                <div>
                    <p>Votre équipe a marqué : <span>{teamScore}</span></p>
                </div>
                <div>
                    <p>Chrono</p>
                    <span>{countdown} secondes</span>
                </div>
                <div>
                    <div className="GP-TeamScore-main">
                        <div className="GP-TeamScore">
                            <p>L'équipe a marqué : <span>{teamScore}</span></p>
                        </div>
                    </div>
                    <div className="GP-player-main">
                        {gameData &&
                            gameData[0].players.map((player) => (
                                <div className="GP-player-wrapper" key={player.playerId}>
                                    <ul>
                                        <h3>{player.playerPseudo}</h3>

                                        {player.playerNumber === currentPlayer && player.playerId === playerId && (
                                            <React.Fragment>
                                                {player.wordlist.map((wordObj, index) => (
                                                    <li
                                                        className={`GP-li-player ${wordObj.status === '1' ? 'valider' : wordObj.status === '2' ? 'refuser' : wordObj.status === '3' || (index === 0 && wordObj.status === '0') ? 'current-word' : ''}`}
                                                        key={wordObj._id}
                                                    >
                                                        {wordObj.word}
                                                    </li>
                                                ))}
                                            </React.Fragment>
                                        )}

                                        {player.playerNumber !== currentPlayer && player.playerId === playerId && (
                                            <p>
                                                <span>c'est à toi deviner</span>
                                            </p>
                                        )}
                                    </ul>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePlayers;