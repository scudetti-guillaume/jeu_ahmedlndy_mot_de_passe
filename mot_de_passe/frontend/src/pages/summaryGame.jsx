import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';

const SummaryGame = () => {
    const navigate = useNavigate();
    const [gameData, setGameData] = useState(null);
    const [teamScore, setTeamScore] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentPlayerNumber, setCurrentPlayerNumbers] = useState(0)
    const [currentPlayerWordList, setCurrentPlayerWordList] = useState(0)


    const getDataGame = async () => {
        try {
            const response = await axios.get("/endgame/getData");
            console.log(response.data);
            setGameData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDataGame();
    }, []);


    useEffect(() => {
        if (gameData) {
            setCurrentWordIndex(gameData[0].currentWordIndex);
            setTeamScore(gameData[0].points)
            setCurrentPlayerNumbers(gameData[0].currentPlayerNumber)
            setCurrentPlayerWordList(gameData[0].currentPlayerWordList)
        }
    }, [currentPlayerNumber, currentPlayerWordList, gameData]);

    const Menu = async () => {
        try {
            navigate('/waitingroom');

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='GM-main'>
            <div>
                <h1>ahmed mot de passe</h1>
            </div>
            <div>
                <div className='SG-TeamScore-main'>
                    <div className='SG-TeamScore'>
                        <p>L'équipe a marqué : <span>{teamScore}</span></p>
                    </div>
                </div>
                <div className='SG-player-main'>
                    {gameData &&
                        gameData[0].players.map((player) => (
                            <div className='SG-player-wrapper' key={player.playerNumber}>
                                <h3>{player.playerPseudo}</h3>
                                <ul>
                                    {player.wordlist.map((wordObj, index) => (
                                        <li
                                            className={`SG-li-player ${player.playerNumber === currentPlayerWordList && currentWordIndex === index
                                                ? 'current-word'
                                                : wordObj.status === '1'
                                                    ? 'valider'
                                                    : wordObj.status === '2'
                                                        ? 'refuser'
                                                        : ''
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
                <div><button onClick={Menu}>Revenir au menu</button></div>
            </div>
        </div>
    );
};

export default SummaryGame;

