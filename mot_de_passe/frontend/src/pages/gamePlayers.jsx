import React, { useEffect, useState} from 'react';
import axios from '../axiosConfig.js';
import { io } from 'socket.io-client';

const GamePlayers = () => {
    const [gameData, setGameData] = useState(null);
    const [round, setRound] = useState(1);
    const [teamScore, setTeamScore] = useState(0);
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        const socket = io(`http://localhost:4000`);

        const getDataGame = async () => {
            try {
                const response = await axios.get("/team/dataGame");
                console.log(response.data);
                setGameData(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        getDataGame();

        socket.on('chrono', (countdown) => {
            console.log(countdown);
            setCountdown(countdown);
        });

        socket.on('update', (gameData) => {
            console.log(gameData);
            setGameData(gameData);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (gameData) {
            setTeamScore(gameData[0].points);
            setRound(gameData[0].rounds)
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
                    <h2>
                        Manche <span>{round}</span>
                    </h2>
                    <div className="GP-TeamScore-main">
                        <div className="GP-TeamScore">
                            <p>L'équipe a marqué : <span>{teamScore}</span></p>
                        </div>
                    </div>
                    <div className="GP-player-main">
                        {gameData &&
                            gameData[0].players.map((player) => (
                                <div className="GP-player-wrapper" key={player.playerId}>
                                    <h3>{player.playerPseudo}</h3>
                                    <ul>
                                        {player.wordlist.map((wordObj, index) => (
                                            <li
                                                className={`GP-li-player ${wordObj.status === '1' ? 'valider' : wordObj.status === '2' ? 'refuser' : wordObj.status === '3' ? 'current-word' : ''
                                                    }`}
                                                key={wordObj._id}
                                            >
                                                {wordObj.word}
                                            </li>
                                        ))}
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
