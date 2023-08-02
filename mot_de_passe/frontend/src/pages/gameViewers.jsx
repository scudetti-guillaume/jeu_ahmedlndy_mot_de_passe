import React, { useEffect, useState } from 'react';
import { socket } from '../config.js';
import { useNavigate } from 'react-router-dom';



const GameViewers = () => {
    const navigate = useNavigate();
    const [gameData, setGameData] = useState(null);

    
    const getDataGame = async () => {
        try {
            // const response = await axiosBase.get("/team/dataGame")
            socket.emit('getDataGame',(response)=>{
            console.log(response);
            setGameData(response.data);
            const first = response.data[0].players[0].wordlist[0].status
            console.log(first);
            })
        } catch (error) {
            console.log(error);
        }
    };

useEffect(()=>{
    getDataGame();

})


    useEffect(() => {
    
        socket.on('Game', (gameData) => {
            setGameData(gameData);
        });

        socket.on('update', (gameData) => {
        window.location.reload()
            setGameData(gameData);

        });


        return () => {
            socket.disconnect();
        };
    },);

    useEffect(() => {
        if (gameData) {
            if (gameData[0].reset) {
                navigate('/waitingroom');
            }
            if (gameData[0].finish) {
                navigate('/recap');
            }
        }

   
    }, [gameData, navigate],);
    
    if (!gameData) {
        getDataGame();
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