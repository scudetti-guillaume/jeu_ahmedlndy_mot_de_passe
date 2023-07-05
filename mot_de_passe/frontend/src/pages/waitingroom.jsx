import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Waitingroom = () => {
    const socket = io(`http://localhost:4000`);
    const [players, setPlayers] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [team1, setTeam1] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await axios.get('/team/team');
                const selectedPlayerIds = response.data;
                setTeam1(selectedPlayerIds);
            } catch (error) {
                console.error("Erreur lors de la récupération des joueurs de l'équipe :", error);
            }
        };
        fetchTeam();
    }, []);
    
    const fetchPlayers = async () => {
        try {
            const response = await axios.get('/player/all');
            setPlayers(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des joueurs :', error);
        }
    };

    useEffect(() => {
        // Effect pour récupérer les joueurs de la base de données
      
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
                        console.log(player1);
                    } else {
                        const player2 = { ...playerToAdd, role: 'Joueur 2' };
                        setTeam1((prevTeam1) => [
                            ...prevTeam1.slice(0, teamSize - 1),
                            player2,
                            prevTeam1[teamSize - 1],
                        ]);
                    }
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
            if (data) {
                const selectedPlayerIds = data[0].map(player => player._id);
                if (userRole === 'gameMaster') {
                    navigate('/gameGM');
                }
                if (selectedPlayerIds.includes(userId)) {
                    navigate('/gamePlayer');
                } 
                else if (userRole === 'gameMaster') {
                    navigate('/gameGM');
                } 
                else {
                    navigate('/gameViewers');
                }
            } else {
                return <div>ça charge</div>
            }
        });

        // Clean up the Socket.IO connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, [navigate, players, team1, userRole, userId]);
    
    useEffect(() => {
        socket.on('newlogin', () => {
            fetchPlayers();
        });
     
        return () => {
            socket.disconnect();
        }
    }, [socket, navigate])


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
                console.log(player.role);
                // console.log(player2);
                axios.post("/team/addplayer", { playerId: playerId, playerNumber: player.role }).then((doc) => {
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
        // const data = localStorage.getItem('role')
        // console.log("lz" + data);
        console.log(setTeam1);
        if (userRole === 'gameMaster' && team1.length === 2) {
            axios.post("/team/launchgame").then((doc) => {
                console.log(doc);
            })

            // Rediriger vers la page "/game" avec les joueurs sélectionnés
            // navigate('/game', { players: team1 });
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
