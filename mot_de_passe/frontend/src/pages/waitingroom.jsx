import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';

const Waitingroom = () => {
    const [players, setPlayers] = useState([]);
    const [user, setUser] = useState(null);
    const [team1, setTeam1] = useState([]);
    const navigate = useNavigate();
    

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

    const handleDragStart = (e, playerId, fromTeam) => {
        const isGameMaster = user === 'gameMaster';
        console.log(user);
        console.log(isGameMaster);
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
            } else {
                alert('Équipe complète !');
            }
        }
    };

    const handleDropPlayers = (e) => {
        e.preventDefault();
        const playerId = e.dataTransfer.getData('playerId');
        const playerToAdd = team1.find((player) => player._id === playerId);
        if (playerToAdd) {
            setPlayers((prevPlayers) => [...prevPlayers, playerToAdd]);
            setTeam1((prevTeam1) => prevTeam1.filter((player) => player._id !== playerId));
        }
    };

    const handleRemovePlayer = (playerId) => {
        const playerToRemove = team1.find((player) => player._id === playerId);
        if (playerToRemove) {
            setPlayers((prevPlayers) => [...prevPlayers, playerToRemove]);
            setTeam1((prevTeam1) => prevTeam1.filter((player) => player._id !== playerId));
        }
    };
    
    const handleStartGame = () => {
        if (user === 'gameMaster' && team1.length === 2) {
            // Rediriger vers la page "/game" avec les joueurs sélectionnés
            navigate('/game', { players: team1 });
        }
    };

    return (
        <div className="wr-main">
            <h1>Mot de passe</h1>
            <h2 className="wrMainH2">Salle d'attente</h2>
            <div className="wrWrapper">
                <div className="wrPlayerlistMain">
                    <h2 className="wrPlayerh2">Joueurs</h2>
                    <ul className="wrPlayerUl" onDragOver={handleDragOver} onDrop={handleDropPlayers}>
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

                                <p>Joueur {index % 2 === 0 ? 1 : 2}:</p>
                                <p>{player.pseudo}</p>
                                <button className='wrTMButton' onClick={() => handleRemovePlayer(player._id)}>Retirer le joueur</button>
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
