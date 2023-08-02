import React, { useEffect, useState } from 'react';
import { socket} from '../config.js';
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
            socket.emit('getGameSettings',(res)=>{
            if (res.success) {
            console.log(res);
                    setTimePerRound(res.data[0].chrono)
                    setNumWordsPerRound(res.data[0].wordsNumber)
                } else {
                    return <div>tu n'est pas GameMaster</div>
                }
            })
            // await axiosBase.get("/gamemaster/getGameSettings").then((doc) => {
            //     if (doc) {
            //     setTimePerRound(doc.data[0].chrono)
            //         setNumWordsPerRound(doc.data[0].wordsNumber)
            //         console.log(doc);
            //     } else {
            //         return <div>tu n'est pas GameMaster</div>
            //     }
            // })
        }
        verifyMaster()
    }, [token]);
    
   
    const changeSetting = async () => {
      
        const data = {
            wordsNumber: timePerRound,
            chrono: numWordsPerRound
        };
    
        try {
            socket.emit('getManageGame', { token: token, data: data },(res)=>{
            if (res.success) { console.log(res);
            } else {
                return <div>tu n'est pas GameMaster</div>
            }
            })
        //     await axiosBase.post("/gamemaster/manageGame", { token: token, data : data }).then((doc)=>{
        //     console.log(doc);
        //     })
           
        } catch (error) {
        console.log(error);
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
        <div className='Main-mg'>
            <h2 className='h2-mg'>Paramètres</h2>
            <form className='Form-mg' onSubmit={handleSubmit}>
                <div className='RoundTime-mg'>
                    <label htmlFor="timePerRound">Temps par manche (en minutes) :</label>
                    <input
                        type="number"
                        id="timePerRound"
                        value={timePerRound}
                        onChange={handleTimeChange}
                    />
                </div>
                <div className='RoundWord-mg'>
                    <label htmlFor="numWordsPerRound">Nombre de mots par manche :</label>
                    <input
                        type="number"
                        id="numWordsPerRound"
                        value={numWordsPerRound}
                        onChange={handleNumWordsChange}
                    />
                </div>
                <button className='btn-register-mg' type="submit">Enregistrer</button>
            </form>
            <div className='GM-btn-valide'><button className='GM-btn-word-btn-valide' onClick={handleBackToWaitingRoom}>Retour </button></div>
        </div>
    );

};

export default ManageGame;