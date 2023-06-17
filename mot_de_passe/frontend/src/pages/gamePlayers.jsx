import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const GamePlayers = () => {
    const socket = io(`http://localhost:4000`);
    const navigate = useNavigate();
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
        
        socket.on('endgame', () => {
            navigate('/recap');
            });
            
            
        socket.on('reset', () => {
            navigate('/waitingroom');
        });
        
        return () => {
            socket.disconnect();
        };
        
    }, [navigate, socket]);

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
                <h2 className="GP-round">
                    Manche <span>{round}</span>
                </h2>
                
                <div>
                    <div className="GP-TeamScore-main">
                        <div className="GP-TeamScore">
                            <p>Votre équipe à un score de : <span className="GP-teamScore">{teamScore}</span></p>
                        </div>
                    </div>
                    <div className="GP-chrono">
                        <p>Chrono : </p>
                        <span className="GP-chrono-coutndown">{countdown} secondes</span>
                    </div>
                    <div className="GP-player-main">
                        {gameData &&
                            gameData[0].players.map((player) => (
                                <div className="GP-player-wrapper" key={player.playerId}>
                                        {player.playerNumber === currentPlayer && player.playerId === playerId && (
                                            <React.Fragment>
                                            <h3>{player.playerPseudo}</h3>
                                            <ul>
                                                {player.wordlist.map((wordObj, index) => (

                                                    <li
                                                        className={`GP-li-player ${wordObj.status === '1' ? 'valider' : wordObj.status === '2' ? 'refuser' : wordObj.status === '3' || (index === 0 && wordObj.status === '0') ? 'current-word' : ''}`}
                                                        key={wordObj._id}
                                                    >
                                                        {wordObj.word}
                                                    </li>
                                                   
                                                ))}
                                                    </ul>
                                            </React.Fragment>
                                        )}

                                        {player.playerNumber !== currentPlayer && player.playerId === playerId && (              
                                            <p className='GP-span-player'>
                                            <h3>{player.playerPseudo}</h3>
                                                <span>c'est à toi deviner</span>
                                            </p>
                                        )}
                                  
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePlayers;