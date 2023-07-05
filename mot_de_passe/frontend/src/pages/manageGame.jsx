import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom'; 

const ManageGame = () => {
    const navigate = useNavigate();
    const [timePerRound, setTimePerRound] = useState('');
    const [numWordsPerRound, setNumWordsPerRound] = useState('');
    const [token, setToken] = useState('');
    
    

    useEffect(() => {
    
        const verifyMaster = async () => {
            const getToken = localStorage.getItem('token');

            setToken(getToken)
            await axios.get("/gamemaster/getGameSettings").then((doc) => {
                if (doc) {
                setTimePerRound(doc.data[0].chrono)
                    setNumWordsPerRound(doc.data[0].wordsNumber)
                    console.log(doc);
                } else {
                    return <div>tu n'est pas GameMaster</div>
                }
            })
        }
        verifyMaster()
    }, [token]);
    
   
    const changeSetting = async () => {
      
        const data = {
            wordsNumber: timePerRound,
            chrono: numWordsPerRound
        };
    
        try {
            await axios.post("/gamemaster/manageGame", { token: token, data : data }).then((doc)=>{
            
            console.log(doc);
            
            })
           
        } catch (error) {
            // Gérer les erreurs de la requête
        }
    };

    const handleBackToWaitingRoom = () => {
        navigate('/waitingroom');
    };
    const handleTimeChange = (e) => {
        setTimePerRound(e.target.value);
    };
    
    const handleNumWordsChange = (e) => {
        setNumWordsPerRound(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        changeSetting(); 
        setTimePerRound(numWordsPerRound);
        setNumWordsPerRound(timePerRound);
    };
    

    return (
        <div>
            <h2>Paramètres</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="timePerRound">Temps par manche (en minutes) :</label>
                    <input
                        type="number"
                        id="timePerRound"
                        value={timePerRound}
                        onChange={handleTimeChange}
                    />
                </div>
                <div>
                    <label htmlFor="numWordsPerRound">Nombre de mots par manche :</label>
                    <input
                        type="number"
                        id="numWordsPerRound"
                        value={numWordsPerRound}
                        onChange={handleNumWordsChange}
                    />
                </div>
                <button type="submit">Enregistrer</button>
            </form>
            <div className='GM-btn-valide'><button className='GM-btn-word-btn-valide' onClick={handleBackToWaitingRoom}>Retour </button></div>
        </div>
    );

};

export default ManageGame;