import React, { useEffect, useState, useRef } from 'react';
import Chrono from '../components/chronoGM';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom'; 
import { io } from 'socket.io-client';

const GameGM = () => {
    const socket = io(`http://localhost:4000`);
    const navigate = useNavigate(); 
    const chronoRef = useRef(null);
    const [gameData, setGameData] = useState(null);
    const [round, setRound] = useState(1);
    const [teamScore, setTeamScore] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentPlayerNumber, setCurrentPlayerNumbers] = useState(0)
    const [currentPlayerWordList, setCurrentPlayerWordList] = useState(0)
    const [clicCounter, setClicCounter] = useState(0)
    const numWordsPerRound = 6;
    const numWordsPerRound_2 = 12;


    const getWords = async (numWords, usedWords) => {
        try {
            const response = await fetch(`https://api.datamuse.com/words?ml=fr&max=1000`);
            const data = await response.json();
            const frenchWords = data
                .filter(word => word.word.match(/^[a-zA-ZÀ-ÿ]{6,}$/))
                .map(word => word.word.toLowerCase());
            const newWords = frenchWords.filter(word => !usedWords.includes(word));
            for (let i = newWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newWords[i], newWords[j]] = [newWords[j], newWords[i]];
            }
            const player1Words = newWords.slice(0, numWords / 2).map(word => ({ word, status: 0 }));
            const player2Words = newWords.slice(numWords / 2, numWords).map(word => ({ word, status: 0 }));
            await axios.post("/team/words", { player1Words, player2Words });
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getDataGame = async () => {
        try {
            await getWords(numWordsPerRound, [])
            const response = await axios.get("/team/dataGame");
            console.log(response.data);
            setGameData(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    const getDataGame_2 = async () => {
        try {
            await getWords(numWordsPerRound_2, [])
            const response = await axios.get("/team/dataGame");
            setGameData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const regenWords = async () => {
        try {
            await axios.patch("/team/regenwords")
            await getDataGame_2()
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    
  
    useEffect(() => {
        getDataGame();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (gameData) {
            setCurrentWordIndex(gameData[0].currentWordIndex);
            setTeamScore(gameData[0].points)
            setCurrentPlayerNumbers(gameData[0].currentPlayerNumber)
            setCurrentPlayerWordList(gameData[0].currentPlayerWordList)
            setClicCounter(gameData[0].currentAttempt)
        }
    }, [clicCounter, currentPlayerNumber, currentPlayerWordList, gameData]);



    const handleValiderMot = async () => {
        const updatedGameData = [...gameData];
        const currentPlayer = updatedGameData[0].players[currentPlayerNumber];
        const currentPlayerWordlist = updatedGameData[0].currentPlayerWordList
        const reponseSend = updatedGameData[0].currentAttempt
        const currentWord = currentPlayer.wordlist[currentWordIndex];
        const nextWord = currentPlayer.wordlist[currentWordIndex + 1]

        if (currentWordIndex === currentPlayer.wordlist.length - 1 && updatedGameData[0].currentPlayerWordList === 1) {
            setRound(2)
            setCurrentPlayerNumbers(1)
            setCurrentPlayerWordList(1)
            setCurrentWordIndex(0);
            setTeamScore((prevScore) => prevScore + 1);
            const nextWord = updatedGameData[0].players[1].wordlist[0]
            currentWord.status = 1;
            console.log(nextWord);
            updatedGameData[0].currentWord = nextWord.word
            nextWord.status = 3
            updatedGameData[0].currentWordIndex = 0
            updatedGameData[0].currentPlayerNumber = 1
            updatedGameData[0].currentPlayerWordList = currentPlayerWordlist + 1
            updatedGameData[0].rounds = 2
            updatedGameData[0].currentAttempt = reponseSend + 1
            updatedGameData[0].points = teamScore + 1
            await axios.post("/team/update", { gameData: updatedGameData });
            const response = await axios.get("/team/dataGame");
            setGameData(response.data)
            chronoRef.current.reset();
          
            // window.location.reload();
        } else {
            if (currentWordIndex === currentPlayer.wordlist.length - 1 && updatedGameData[0].currentPlayerWordList === 2) {
                console.log('laupuoi');
                setTeamScore((prevScore) => prevScore + 1);
                setCurrentWordIndex((prevScore) => prevScore + 1)
                currentWord.status = 1;
                updatedGameData[0].currentAttempt = reponseSend + 1
                updatedGameData[0].points = teamScore + 1
                updatedGameData[0].currentWordIndex = currentWordIndex + 1
                // Make the API call to update the backend with the updated data
                await axios.post("/team/update", { gameData: updatedGameData });
                const response = await axios.get("/team/dataGame");
                setGameData(response.data)
                chronoRef.current.reset();
            }else{
            console.log('laup');
            console.log(nextWord);
            setTeamScore((prevScore) => prevScore + 1);
            setCurrentWordIndex((prevScore) => prevScore + 1)
            currentWord.status = 1;
            nextWord.status = 3
            updatedGameData[0].currentWord = nextWord
            updatedGameData[0].currentAttempt = reponseSend + 1
            updatedGameData[0].points = teamScore + 1
            updatedGameData[0].currentWordIndex = currentWordIndex + 1
            // Make the API call to update the backend with the updated data
            await axios.post("/team/update", { gameData: updatedGameData });
            const response = await axios.get("/team/dataGame");
            setGameData(response.data)
            chronoRef.current.reset();
         }

        }
        if (clicCounter === numWordsPerRound_2 ) {
            await axios.get("/endgame/endGame");
            // alert('fin du game')
        }
    };

    const handleRefuserMot = async () => {
        const updatedGameData = [...gameData];
        const currentPlayer = updatedGameData[0].players[currentPlayerNumber];
        const currentPlayerWordlist = updatedGameData[0].currentPlayerWordList
        const reponseSend = updatedGameData[0].currentAttempt
        const currentWord = currentPlayer.wordlist[currentWordIndex];
        const nextWord = currentPlayer.wordlist[currentWordIndex + 1]

        if (currentWordIndex === currentPlayer.wordlist.length - 1 && updatedGameData[0].currentPlayerWordList === 1) {
            setRound(2)
            setCurrentPlayerNumbers(1)
            setCurrentPlayerWordList(1)
            setCurrentWordIndex(0);
            const nextWord = updatedGameData[0].players[1].wordlist[0]
            currentWord.status = 2;
            console.log(nextWord);
            updatedGameData[0].currentWord = nextWord.word
            nextWord.status = 3
            updatedGameData[0].currentWordIndex = 0
            updatedGameData[0].currentPlayerNumber = 1
            updatedGameData[0].currentPlayerWordList = currentPlayerWordlist + 1
            updatedGameData[0].rounds = 2
            updatedGameData[0].currentAttempt = reponseSend + 1
            await axios.post("/team/update", { gameData: updatedGameData });
            const response = await axios.get("/team/dataGame");
            setGameData(response.data)
            chronoRef.current.reset();
        } else {
            if (currentWordIndex === currentPlayer.wordlist.length - 1 && updatedGameData[0].currentPlayerWordList === 2) {
                console.log('laupuoi');
                setCurrentWordIndex((prevScore) => prevScore + 1)
                currentWord.status = 2;
                updatedGameData[0].currentAttempt = reponseSend + 1
                updatedGameData[0].currentWordIndex = currentWordIndex + 1
                // Make the API call to update the backend with the updated data
                await axios.post("/team/update", { gameData: updatedGameData });
                const response = await axios.get("/team/dataGame");
                setGameData(response.data)
                chronoRef.current.reset();
            } else {
                console.log('laup');
                console.log(nextWord);
                setCurrentWordIndex((prevScore) => prevScore + 1)
                currentWord.status = 2;
                nextWord.status = 3
                updatedGameData[0].currentWord = nextWord
                updatedGameData[0].currentAttempt = reponseSend + 1
                updatedGameData[0].currentWordIndex = currentWordIndex + 1
                // Make the API call to update the backend with the updated data
                await axios.post("/team/update", { gameData: updatedGameData });
                const response = await axios.get("/team/dataGame");
                setGameData(response.data)
                chronoRef.current.reset();
            }
        }
        if (clicCounter === numWordsPerRound_2 ) {
            await axios.get("/endgame/endGame");
            // alert('fin du game')
        }
    };

    const handleTimeout = () => {
        // Logique à exécuter lorsque le chrono atteint 0
        // ...
    };
    
    const resetGame = async () => {
        try {
            await axios.patch("/team/reset").then((doc)=>{
            console.log(doc);          
            })
        } catch (error) {
        console.log(error);
        }
    }
    useEffect(()=>{
        socket.on('reset', () => {
            navigate('/waitingroom');
        });
        socket.on('endgame', () => {
            navigate('/recap');
        });
        return () => {
            socket.disconnect();
        }
    })
    
    return (
        <div className='GM-main'>
            <div>
                <h1>ahmed mot de passe</h1>
            </div>
            <div>
                <h2 className='GM-round'>
                    Manche <span>{round}</span>
                </h2>
                <div className='GM-button-main'>
                    <div className='GM-button-reset-wrapper'><button className='GM-button-reset' onClick={resetGame}>Reset la game</button></div>
                    <div className='GM-button-regen-wrapper'><button className='GM-button-regen' onClick={regenWords}>Regenerer une liste de mots</button></div>
                </div>
                <Chrono ref={chronoRef} initialTime={30} onTimeout={handleTimeout} />
                <div className='GM-TeamScore-main'>
                    <div className='GM-TeamScore'>
                        <p className='GM-TeamScore-point'>L'équipe a marqué : <span className='GM-TeamScore-point-span'>{teamScore}</span></p>
                    </div>
                    <div className='GM-btn-word'>
                        <div className='GM-btn-valide'>
                            <button className='GM-btn-word-btn-valide' onClick={handleValiderMot} disabled={clicCounter === numWordsPerRound_2 + 1}>Valider mot</button>
                        </div>
                        <div className='GM-btn-refuse'>
                            <button className='GM-btn-word-btn-refuse' onClick={handleRefuserMot} disabled={clicCounter === numWordsPerRound_2 + 1}>Refuser mot</button>
                        </div>
                    </div>
                </div>
                <div className='GM-player-main'>
                    {gameData &&
                        gameData[0].players.map((player) => (
                            <div className='GM-player-wrapper' key={player.playerNumber}>
                                <h3 className='GM-player-name'>{player.playerPseudo}</h3>
                                <ul>
                                    {player.wordlist.map((wordObj, index) => (
                                        <li
                                            className={`GM-li-player ${player.playerNumber === currentPlayerWordList && currentWordIndex === index
                                                ? 'current-word'
                                                : wordObj.status === '1'
                                                    ? 'valider'
                                                    : wordObj.status === '2'
                                                        ? 'refuser'
                                                        : (round === 2 && player.playerNumber === currentPlayerWordList && index < currentWordIndex)
                                                            ? 'current-word'
                                                            : wordObj.status === '1'
                                                                ? 'valider'
                                                                : wordObj.status === '2'
                                                                    ? 'refuser'
                                                                    : ''
                                                }`}
                                            key={wordObj._id}
                                        >
                                            {wordObj.word}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                </div>

            </div>
        </div>
    );
};

export default GameGM;

