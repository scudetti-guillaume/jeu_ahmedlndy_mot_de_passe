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
                }

            // const response = await axiosBase.get("/team/dataGame")
            setRound(response.data[0].rounds)
            setGameData(response.data);
            setCountdown(response.data[0].chrono)
            setCurrentPlayer(response.data[0].currentPlayerWordList)
                }
            }
            })
        } catch (error) {
            console.log(error);
        }
    };
    
    const removePlayer = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('pseudo');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    socket.on('Game', (data) => {  
    console.log(data);
            setGameData(data);
            setRound(data[0].rounds)
            setCountdown(data[0].chrono)
            setCurrentPlayer(data.currentPlayerWordList);
        
    });




    useEffect(() => {
   
       
        socket.on('reset', () => {
            navigate('/waitingroom');
        });

        socket.on('update', async (response) => {
            if (response.success) {
                const data = await response.data
            // window.location.reload()
                setGameData(data);   
                setRound(data.rounds)
                setCurrentPlayer(data.currentPlayerWordList)
                setCountdown(data.chrono);
                setClicCounter(data.currentAttempt)
            }
        });
        

     
        // return () => {
        //     socket.disconnect();
        // };
        
    }, [navigate]);
    
     useEffect(()=>{
         getDataGame();
     },[])
     
     
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
    }, [gameData, navigate]);

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
                        <span className="GP-chrono-coutndown">{gameData[0].chrono} secondes</span>
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