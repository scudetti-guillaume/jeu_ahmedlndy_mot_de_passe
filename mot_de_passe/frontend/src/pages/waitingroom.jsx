import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Waitingroom = () => {
    const [players, setPlayers] = useState([]);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [team1, setTeam1] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await axios.get('/team/team');
                const selectedPlayerIds = response.data;
                console.log(selectedPlayerIds);
                setTeam1(selectedPlayerIds);
            } catch (error) {
                console.error("Erreur lors de la récupération des joueurs de l'équipe :", error);
            }
        };
        fetchTeam();
    }, []);

    useEffect(() => {
        // Effect pour récupérer les joueurs de la base de données
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('/player/all');
                console.log(response.data);
                setPlayers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des joueurs :', error);
            }
        };
        fetchPlayers();
    }, []);
    
    
     

    useEffect(() => {
        // const fetchGameMaster = async () => {
        //     try {
        //         const response = await axios.get('/gamemaster/gamemaster');
        //         console.log(response.data[0].role);
        //         setUser(response.data[0].role);
        //     } catch (error) {
        //         console.error('Erreur lors de la récupération du gamemaster :', error);
        //     }
        // };
        // fetchGameMaster();
        const getGameMaster = async () => {
            try {
                const data = localStorage.getItem('role')
                setUser(data);
            } catch (error) {
                console.error('Erreur lors de la récupération du gamemaster :', error);
            }
        }; getGameMaster()
    }, []);

    useEffect(() => {
        // const fetchGameMaster = async () => {
        //     try {
        //         const response = await axios.get('/gamemaster/gamemaster');
        //         console.log(response.data[0].role);
        //         setUser(response.data[0].role);
        //     } catch (error) {
        //         console.error('Erreur lors de la récupération du gamemaster :', error);
        //     }
        // };
        // fetchGameMaster();
        const getUserId = async () => {
            try {
                const data = localStorage.getItem('user')
                setUserId(data);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'id user :", error);
            }
        }; getUserId()
    }, []);

    useEffect(() => {
        const socket = io(`http://localhost:4000`);
        socket.on('playerAdded', (playerId) => {
            // console.log(playerId);
            const playerToFind = playerId
            const playerToAdd = players.find((player) => player._id === playerToFind);
            // console.log(playerToAdd);
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
                    // setPlayers((prevPlayers) => prevPlayers.filter((player) => player._id !== playerId));

                }
            }
        });

        // Listen for the 'playerRemoved' event
        socket.on('playerRemoved', (playerId) => {
            const playerToRemove = team1.find((player) => player._id === playerId);
            if (playerToRemove) {
                setPlayers((prevPlayers) => [...prevPlayers, playerToRemove]);
                setTeam1((prevTeam1) => prevTeam1.filter((player) => player._id !== playerId));
                axios.patch("/team/removeplayer", { playerId: playerToRemove._id }).then((doc) => {
                    console.log(doc);
                })
            }
        });

        socket.on('startGame', (data) => {
            data[0].forEach(player => {
                console.log(player._id);
                if (userId === player._id) {
                    navigate('/gamePlayer');
                }
                if (user === 'gameMaster' ) {
                    navigate('/gameGM');
                }
                
            });
            
            // navigate('/game', { players: team1 });
           
        });

        // Clean up the Socket.IO connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, [navigate, players, team1, user, userId]);


    const handleDragStart = (e, playerId, fromTeam) => {
        const isGameMaster = user === 'gameMaster';
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
                setPlayers((prevPlayers) => prevPlayers.filter((player) => player._id !== playerId));
                axios.post("/team/addplayer", { playerId: playerId }).then((doc) => {
                    console.log(doc);
                })
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
            axios.patch("/team/removeplayer", { playerId: playerToRemove._id }).then((doc) => {
                console.log(doc);
            })
        }
    };

    const handleStartGame = () => {
        if (user === 'gameMaster' && team1.length === 2) {
            axios.post("/team/launchgame").then((doc) => {
                console.log(doc);
            })

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
                                className="wrPlayerIl"
                                key={player._id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, player._id, false)}
                                style={{ cursor: 'grab', }}
                            >
                                {player.pseudo}
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
                                {(user === 'gameMaster' || userId === player._id ) &&  (
                                <button className='wrTMButton' onClick={() => handleRemovePlayer(player._id)}>Retirer le joueur</button>
                                )}
                            </li>
                        ))}
                    </ul>
                    {user === 'gameMaster' && team1.length === 2 && (
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
