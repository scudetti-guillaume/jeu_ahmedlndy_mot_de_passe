import React, { useEffect, useState } from 'react';
import { socket } from '../config.js';
import { useNavigate } from 'react-router-dom';

const GamePlayers = () => {
    const navigate = useNavigate();
    const [gameData, setGameData] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [playerId, setPlayerId] = useState(null)
    const [round,setRound] = useState(null)
    const [currentPlayer, setCurrentPlayer] = useState(1)
    const [clicCounter, setClicCounter] = useState(0);
    const [points, setTeamScore] = useState(0);
  
   
    const getDataGame = async () => {
        try {
            const player = localStorage.getItem('user')
           setPlayerId(player)
            socket.emit('getDataGame',(response)=>{
            console.log(response.data[0]);
            if (response.success){
                if (response.data && response.data.length > 0) {
                const gameDataProps = Object.values(response.data[0]);
                if (gameDataProps.includes(undefined)) {
                    window.location.reload()
                    return <div>ça charge ...</div>
                }else{
            setGameData(response.data);
            setRound(response.data[0].rounds)
            setCountdown(response.data[0].chrono)
            setCurrentPlayer(response.data[0].currentPlayerWordList)
                }
                }
            }
            })
        } catch (error) {
            console.log(error);
        }
    };
    
    
    useEffect(() => {
        getDataGame();
    }, [])

    
    const removePlayer = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('pseudo');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };




    useEffect(() => {
        socket.on('Game', async (data) => {
        console.log('dataGame');
            if (data !== undefined ) {
                const gameDataProps = Object.values(data[0]);
                if (gameDataProps.includes(undefined)) {
                    window.location.reload()
                    return <div>ça charge ...</div>
                } else {
                console.log(data);
            setGameData(data);
                }
                } else {
                socket.emit('getDataGame', (response) => {
                    console.log('updateviaData');
                    if (response.success) {
                        if (response.data && response.data.length > 0) {
                            const gameDataProps = Object.values(response.data[0]);
                            if (gameDataProps.includes(undefined)) {
                                window.location.reload()
                                return <div>ça charge ...</div>
                            } else {
                                setGameData(response.data[0]);
                                setRound(response.data[0].rounds)
                                setCountdown(response.data[0].chrono)
                                setCurrentPlayer(response.data[0].currentPlayerWordList)
                            }
                        }
                    }
                })           
                }
        });
        
        socket.on('chrono', async (response) => {
        console.log(response);
            setCountdown(response)
        });

       
        socket.on('reset', () => {
            navigate('/waitingroom');
        });

        socket.on('endGamePlayer', () => {
            removePlayer()
            navigate('/recap');
        });

        
    }, [navigate]);
    
  
     
    useEffect(() => {
        if (gameData) {
            if (gameData && gameData.length > 0) {
            const gameDataProps = Object.values(gameData[0]);
            if (gameDataProps.includes(undefined)) {
                getDataGame();
                return <div>ça charge ...</div>            
            }
            setCurrentPlayer(gameData[0].currentPlayerWordList);
            setCountdown(gameData[0].chrono);
            setClicCounter(gameData[0].currentAttempt)
            setRound(gameData[0].rounds)
            setTeamScore(gameData[0].points)
            if (round === undefined){
                getDataGame();
            }
            if (points === undefined) {
                getDataGame();
            }
            
            if (gameData[0].reset) {
                navigate('/waitingroom');
            }
            if (gameData[0].finish) {
                removePlayer()
                navigate('/recap');
            }
        }
    }
    }, [gameData, navigate, points, round]);

    if (!gameData) {
        return <div>ça charge ...</div>
    }

    return (
        <div className="GP-main">
            <div>
                <h1>hamed mot de passe</h1>
            </div>
            <div>
                <h2 className="GP-round">
                    Manche <span>{gameData[0].rounds}</span>
                </h2>
                
                <div>
                    <div className="GP-TeamScore-main">
                        <div className="GP-TeamScore">
                            <p>Votre équipe à un score de : <span className="GP-teamScore">{gameData[0].points}</span></p>
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