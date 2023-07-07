import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const GameViewers = () => {
    const socket = io(`http://localhost:4000`);
    const navigate = useNavigate();
    const [gameData, setGameData] = useState(null);
    // const [round, setRound] = useState(1);
    // const [teamScore, setTeamScore] = useState(0);
    // const [countdown, setCountdown] = useState(30);
    // const [clicCounter, setClicCounter] = useState(0);
    // const [numberWord, setNumberWord] = useState('');
    // const [playerId, setPlayerId] = useState(null)
    // const [currentPlayer, setCurrentPlayer] = useState(1)
    
    const getDataGame = async () => {
        try {
            const response = await axios.get("/team/dataGame")
            setGameData(response.data);
            // setTeamScore(response.data[0].points);
            // setRound(response.data[0].rounds)
            // setCountdown(gameData[0].chrono);
            // setNumberWord(response.data[0].wordsNumber)
            const first = response.data[0].players[0].wordlist[0].status
            console.log(first);
        } catch (error) {
            console.log(error);
        }
    };

useEffect(()=>{
    getDataGame();

})


    useEffect(() => {
    
        // getDataGame();
        
        // socket.on('reset', (resetGame) => {
        //     console.log(resetGame);
        //     navigate('/waitingroom');
        // });

        socket.on('Game', (gameData) => {
            setGameData(gameData);
            // setTeamScore(gameData.points);
            // setRound(gameData.rounds);
            // setCountdown(gameData.chrono);
            // setClicCounter(gameData.currentAttempt)
            // setCurrentPlayer(gameData.currentPlayerWordList);
        });

        socket.on('update', (gameData) => {
        window.location.reload()
            setGameData(gameData);
            // setTeamScore(gameData.points);
            // setRound(gameData.rounds)
            // setCountdown(gameData.chrono);
            // setClicCounter(gameData.currentAttempt)
            // setCurrentPlayer(gameData.currentPlayerWordList)
        });

        // socket.on('chrono', (countdown) => {
        //     setCountdown(countdown);
        // });
    
        // socket.on('endgame', () => {
        //     navigate('/recap');
        // });

        return () => {
            socket.disconnect();
        };
    },);

    useEffect(() => {
        // setGameData(gameData);
        if (gameData) {
            // setCurrentPlayer(gameData[0].currentPlayerWordList);
            // setTeamScore(gameData[0].points);
            // setRound(gameData[0].rounds);
            // setCountdown(gameData[0].chrono);
            // setClicCounter(gameData[0].currentAttempt)
            if (gameData[0].reset) {
                navigate('/waitingroom');
            }
            if (gameData[0].finish) {
                navigate('/recap');
            }
        }
        // if (clicCounter === numberWord){
        //     navigate('/recap');
        // }
   
    }, [gameData, navigate],);
    
    if (!gameData) {
       return <div>ça charge ...</div>
    }
    
    return (
        <div className="GV-main">
            <div>
                <h1>hamed mot de passe</h1>
            </div>
            <div>
                <h2 className="GV-round">
                    Manche <span>{gameData[0].rounds}</span>
                </h2>

                <div>
                    <div className="GV-TeamScore-main">
                        <div className="GV-TeamScore">
                            <p>L'équipe à marquer: <span className="GV-teamScore">{gameData[0].points}</span></p>
                        </div>
                    </div>
                    <div className="GV-chrono">
                        <p>Chrono : </p>
                        <span className="GV-chrono-coutndown">{gameData[0].chrono} secondes</span>
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