import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const GameViewers = () => {
    const socket = io(`http://localhost:4000`);
    const navigate = useNavigate();
    const [gameData, setGameData] = useState(null);
    const [round, setRound] = useState(1);
    const [teamScore, setTeamScore] = useState(0);
    const [countdown, setCountdown] = useState(30);
    // const [playerId, setPlayerId] = useState(null)
    // const [currentPlayer, setCurrentPlayer] = useState(1)

    useEffect(() => {
        const getDataGame = async () => {
            try {
                const response = await axios.get("/team/dataGame")
                setGameData(response.data);
                setTeamScore(response.data[0].points);
                setRound(response.data[0].rounds)
                // setCurrentPlayer(response.data[0].currentPlayerWordList)
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
            // setCurrentPlayer(gameData.currentPlayerWordList);

        });


        socket.on('update', (gameData) => {
            console.log(gameData);
            setGameData(gameData);
            setTeamScore(gameData.points);
            setRound(gameData.rounds)
            // setCurrentPlayer(gameData.currentPlayerWordList)

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
            // setCurrentPlayer(gameData[0].currentPlayerWordList);
            setTeamScore(gameData[0].points);
            setRound(gameData[0].rounds);
        }
    }, [gameData]);



    return (
        <div className="GV-main">
            <div>
                <h1>hamed mot de passe</h1>
            </div>
            <div>
                <h2 className="GV-round">
                    Manche <span>{round}</span>
                </h2>

                <div>
                    <div className="GV-TeamScore-main">
                        <div className="GV-TeamScore">
                            <p>L'équipe à marquer: <span className="GV-teamScore">{teamScore}</span></p>
                        </div>
                    </div>
                    <div className="GV-chrono">
                        <p>Chrono : </p>
                        <span className="GV-chrono-coutndown">{countdown} secondes</span>
                    </div>
                    <div className="GV-player-main">
                        {gameData &&
                            gameData[0].players.map((player) => (
                                <div className="GV-player-wrapper" key={player.playerId}>
                                    <h3 className="GV-player-pseudo">{player.playerPseudo}</h3>
                                    {(
                                            <ul>
                                                {player.wordlist.map((wordObj, index) => (
                                                    <li
                                                        className={`GV-li-player ${wordObj.status === '1' ? 'valider' : wordObj.status === '2' ? 'refuser' : wordObj.status === '3' ? 'current-word' : ''}`}
                                                        key={wordObj._id}
                                                    >
                                                        {wordObj.word}
                                                    </li>
                                                ))}
                                            </ul>
                                        
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameViewers;