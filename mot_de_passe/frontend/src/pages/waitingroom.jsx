import React, { useState, useEffect } from 'react';
import { socket } from '../config.js';
import { useNavigate } from 'react-router-dom';


const Waitingroom = () => {
    const [players, setPlayers] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [team1, setTeam1] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                socket.emit('getTeam', (response) => {
                    if (response.success) {
                        const selectedPlayerIds = response.data;
                        setTeam1(selectedPlayerIds);
                    } else {
                        console.error("Erreur lors de la récupération des joueurs de l'équipe :", response.error);
                    }
                });
            } catch (error) {
                console.error("Erreur lors de la récupération des joueurs de l'équipe :", error);
            }
        };
        fetchTeam();
    }, []);
    
    
    const fetchPlayers = async () => {
        try {
            socket.emit('allPlayer', (response) => {
                if (response.success) {
                    console.log(response);
                    setPlayers(response.data); 
                    console.log(setPlayers);
                } else {
                    console.error('Erreur lors de la récupération des joueurs :', response.error);
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des joueurs :', error);
        }
    };
    

  
    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        const getGameMaster = async () => {
            try {
                const data = localStorage.getItem('role')
                setUserRole(data);
            } catch (error) {
                console.error('Erreur lors de la récupération du gamemaster :', error);
            }
        }; getGameMaster()
    }, []);

    useEffect(() => {
        const getUserId = async () => {
            try {
                const data = localStorage.getItem('user')
                setUserId(data);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'id user :", error);
            }
        }; getUserId()
    }, []);

    // useEffect(() => {
    //     socket.on('playerAdded', (playerId) => {
    //     console.log('adddplayeraction');
    //         console.log(playerId);
    //         const playerToFind = playerId.playerId
    //         const playerToAdd = players.find((player) => player._id === playerToFind);
    //         if (playerToAdd) {
    //             const teamSize = team1.length;
    //             if (teamSize < 2) {
    //                 if (teamSize % 2 === 0) {
    //                     const player1 = { ...playerToAdd, role: 'Joueur 1' };
    //                     setTeam1((prevTeam1) => [...prevTeam1, player1]);
    //                 } else {
    //                     const player2 = { ...playerToAdd, role: 'Joueur 2' };
    //                     setTeam1((prevTeam1) => [
    //                         ...prevTeam1.slice(0, teamSize - 1),
    //                         player2,
    //                         prevTeam1[teamSize - 1],
    //                     ]);
    //                 }
    //             }
    //         }
    //     });

    //     socket.on('playerRemoved', (playerId) => {
    //         console.log('deleteeeplayeraction');
    //         console.log(playerId);
    //         const playerToFind = playerId.playerId
    //         const playerToRemove = team1.find((player) => player._id === playerToFind);
    //         if (playerToRemove) {
    //             setPlayers((prevPlayers) => [...prevPlayers, playerToRemove]);
    //             setTeam1((prevTeam1) => prevTeam1.filter((player) => player._id !== playerToFind));
    //             socket.emit('playerRemove', { playerId: playerToRemove._id }, (response) => {
    //                 if (response.success) {
    //                     console.log(response);
    //                     // socket.emit('playerRemoved', playerId)
    //                     console.log('player enlever');
    //                 }
    //             })
    //             // axiosBase.patch("/team/removeplayer", { playerId: playerToRemove._id }).then((doc) => {
    //             //     console.log(doc);
    //             // })
    //         }
    //     });

    //     socket.on('startGame', (data) => {
    //         if (data) {
    //             const selectedPlayerIds = data[0].map(player => player._id);
    //             if (userRole === 'gameMaster') {
    //                 navigate('/gameGM');
    //             }
    //             if (selectedPlayerIds.includes(userId)) {
    //                 navigate('/gamePlayer');
    //             } 
    //             else if (userRole === 'gameMaster') {
    //                 navigate('/gameGM');
    //             } 
    //             else {
    //                 navigate('/gameViewers');
    //             }
    //         } else {
    //             return <div>ça charge</div>
    //         }
    //     });

    // }, [navigate, players, team1, userRole, userId]);
    
    useEffect(() => {
        // Écouteur d'événement pour 'playerAdded'
        const handlePlayerAdded = (playerId) => {
            console.log('playerAdded action');
            console.log(playerId);
            const playerToFind = playerId.playerId;
            const playerToAdd = players.find((player) => player._id === playerToFind);
            if (playerToAdd) {
                const teamSize = team1.length;
                if (teamSize < 2) {
                    if (teamSize % 2 === 0) {
                        const player1 = { ...playerToAdd, role: 'Joueur 1' };
                        setTeam1((prevTeam1) => [...prevTeam1, player1]);
                    } else {
                        const player2 = { ...playerToAdd, role: 'Joueur 2' };
                        setTeam1((prevTeam1) => [
                            ...prevTeam1.slice(0, teamSize - 1),
                            player2,
                            prevTeam1[teamSize - 1],
                        ]);
                    }
                }
                fetchPlayers();
            }
        };

        // Écouteur d'événement pour 'playerRemoved'
        const handlePlayerRemoved = (playerId) => {
            console.log('deleteeeplayeraction');
            console.log(playerId);
            const playerToFind = playerId.playerId;
            const playerToRemove = team1.find((player) => player._id === playerToFind);
            if (playerToRemove) {
                setPlayers((prevPlayers) => [...prevPlayers, playerToRemove]);
                setTeam1((prevTeam1) => prevTeam1.filter((player) => player._id !== playerToFind));
                socket.emit('playerRemove', { playerId: playerToRemove._id }, (response) => {
                    if (response.success) {
                        console.log(response);
                        console.log('player enlever');
                    }
                });
                fetchPlayers();
            }
          
        };

        // Écouteur d'événement pour 'startGame'
        const handleStartGame = (data) => {
        console.log(data);
        console.log('je vais me lancer');
            if (data) {
                console.log(data);
                const selectedPlayerIds = data[0].map((player) => player._id);
                console.log(selectedPlayerIds);
                if (userRole === 'gameMaster') {
                    navigate('/gameGM');
                }
                if (selectedPlayerIds.includes(userId)) {
                    navigate('/gamePlayer');
                } else if (userRole === 'gameMaster') {
                    navigate('/gameGM');
                } else {
                    navigate('/gameViewers');
                }
            } else {
                return <div>ça charge</div>;
            }
        };
    
        socket.on('playerAdded', handlePlayerAdded);
        socket.on('playerRemoved', handlePlayerRemoved);
        socket.on('startGame', handleStartGame);
    
        return () => {
            socket.off('playerAdded', handlePlayerAdded);
            socket.off('playerRemoved', handlePlayerRemoved);
            socket.off('startGame', handleStartGame);
        };
    }, [players, team1, userRole, userId, navigate]);
    
    
    useEffect(() => {
        socket.on('newPlayer', () => {
        console.log('jesuislafecth');
            fetchPlayers();
        });
        socket.on('playerDeleted', () => {
            fetchPlayers();
        });
    }, [navigate])


    const handleDragStart = (e, playerId, fromTeam) => {
        const isGameMaster = userRole === 'gameMaster';
        if (isGameMaster) {
            e.dataTransfer.setData('playerId', playerId.toString());
            e.dataTransfer.setData('fromTeam', fromTeam ? 'true' : 'false');
        } else {
            e.preventDefault();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDropTeam1 = (e) => {
        e.preventDefault();
        const playerId = e.dataTransfer.getData('playerId');
        const playerToAdd = players.find((player) => player._id === playerId);
        let player = {}
        //  let player2 = {}

        if (playerToAdd) {
            const teamSize = team1.length;
            if (teamSize < 2) {
                if (teamSize % 2 === 0) {
                    player = { ...playerToAdd, role: 1 };
                    setTeam1((prevTeam1) => [...prevTeam1, player]);
                    // console.log(player1);
                } else {
                    player = { ...playerToAdd, role: 2 };
                    setTeam1((prevTeam1) => [
                        ...prevTeam1.slice(0, teamSize - 1),
                        player,
                        prevTeam1[teamSize - 1],
                    ]);
                }
                setPlayers((prevPlayers) => prevPlayers.filter((player) => player._id !== playerId));             
                socket.emit('playerAdd', { playerId: playerId, playerNumber: player.role }, (response)=>{
                if (response.success){
                console.log(response);
                    // socket.emit('playerAdded', playerId )
                console.log('player ajouter');
                }
                })               
                // axiosBase.post("/team/addplayer", { playerId: playerId, playerNumber: player.role }).then((doc) => {
                //     console.log(doc);
                // })
            } else {
                alert('Équipe complète !');
            }
        }
    };

    const handleRemovePlayer = (playerId) => {
        const playerToRemove = team1.find((player) => player._id === playerId);
        if (playerToRemove) {
            setPlayers((prevPlayers) => [...prevPlayers, playerToRemove]);
            setTeam1((prevTeam1) => prevTeam1.filter((player) => player._id !== playerId));
            socket.emit('playerRemove', { playerId: playerToRemove._id}, (response) => {
                if (response.success) {
                console.log(response);
                    // socket.emit('playerRemoved', playerId)
                    console.log('player enlever');
                }
            })
            // axiosBase.patch("/team/removeplayer", { playerId: playerToRemove._id }).then((doc) => {
            //     console.log(doc);
            // })
        }
    };

    const handleRemovePlayerDB = (playerId) => {
        socket.emit('playerDelete', { playerId : playerId },(response) =>{
            if (response.success) {
                socket.emit('playerDeleted')
                console.log('player supprimer');
                console.log(response.data);
            }
        })
        // axiosBase.post("/player/deleteplayer",{playerId}).then((doc)=>{
        //     fetchPlayers();
        // })
    }

    const handleStartGame = () => {
        console.log(setTeam1);
        if (userRole === 'gameMaster' && team1.length === 2) {
        socket.emit('launchGame', (response) =>{
            if (response.success) {
            // socket.emit('startGame')
                console.log(response);
            }
        })       
            // axiosBase.post("/team/launchgame").then((doc) => {
            //     console.log(doc);
            // })
        }
    };

    return (
        <div className="wr-main">
            <h1>Mot de passe</h1>
            <h2 className="wrMainH2">Salle d'attente</h2>
            <div className="wrWrapper">
                <div className="wrPlayerlistMain">
                    <h2 className="wrPlayerh2">Joueurs</h2>
                    <ul className="wrPlayerUl" onDragOver={handleDragOver} >
                        {players.map((player) => (
                            <li
                                className="wrPlayerli"
                                key={player._id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, player._id, false)}
                                style={{ cursor: 'grab', }}
                            >
                                <div className="wrPlayerWrapper">
                                    <p>{player.pseudo}</p>
                               <p>{userRole === 'gameMaster'? (
                                    <button className='wrTMButton' onClick={() => handleRemovePlayerDB(player._id)}>
                                        Supprimer
                                    </button>
                                    ) : null}</p> 
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="wrTeamMain">
                    <h2 className="wrTMh2">Équipe 1</h2>
                    <ul className="wrTMlist" onDragOver={handleDragOver} onDrop={handleDropTeam1}>
                        {team1.map((player, index) => (
                            <li className="wrTMlistLi" key={player._id}>
                                <div className="wrTMlistLiDiv">
                                    <p className="wrTMlistLiPlayer">Joueur {index % 2 === 0 ? 1 : 2}:</p>
                                    <p className="wrTMlistLiPseudo">{player.pseudo}</p>
                                </div>
                                {(userRole === 'gameMaster' || userId === player._id) && (
                                    <button className='wrTMButton' onClick={() => handleRemovePlayer(player._id)}>Retirer le joueur</button>
                                )}
                            </li>
                        ))}
                    </ul>
                    {userRole === 'gameMaster' && team1.length === 2 && (
                        <button className="wrStartGameButton" onClick={handleStartGame}>
                            Lancer la partie
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Waitingroom;
  // useEffect(() => {
    //     const fetchTeam = async () => {
    //         try {
    //             const response = await axiosBase.get('/team/team');
    //             const selectedPlayerIds = response.data;
    //             setTeam1(selectedPlayerIds);
    //         } catch (error) {
    //             console.error("Erreur lors de la récupération des joueurs de l'équipe :", error);
    //         }
    //     };
    //     fetchTeam();
    // }, []);

    // const fetchPlayers = async () => {
    //     try {
    //         const response = await axiosBase.get('/player/all');
    //         setPlayers(response.data);
    //     } catch (error) {
    //         console.error('Erreur lors de la récupération des joueurs :', error);
    //     }
    // };
