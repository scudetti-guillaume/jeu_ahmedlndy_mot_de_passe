import React, { useEffect, useState, useRef } from 'react';
import Chrono from '../components/chronoGM';
import { socket } from '../config.js';
import { useNavigate } from 'react-router-dom';

const GameGM = () => {

    const navigate = useNavigate();
    const chronoRef = useRef(null);
    const [gameData, setGameData] = useState(null);
    const [round, setRound] = useState(1);
    const [teamScore, setTeamScore] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentPlayerNumber, setCurrentPlayerNumbers] = useState(0)
    const [currentPlayerWordList, setCurrentPlayerWordList] = useState(0)
    const [countdown, setCountdown] = useState(0);
    const [numberWord, setNumberWord] = useState(0);
    const [clicCounter, setClicCounter] = useState(0)
    const [gamemaster, setGameMaster] = useState(false)
    const [token, setToken] = useState('');
    const numWordsPerRound = numberWord;

    useEffect(() => {
        const verifyMaster = async () => {
            const getToken = localStorage.getItem('token');
            setToken(getToken);

            const res = await new Promise((resolve, reject) => {
                socket.emit('getGameMaster', { token: token }, (response) => {
                    resolve(response);
                });
            });

            if (res.success) {
                if (res.data === 'not gamemaster') {
                    setGameMaster(false);
                } else {
                    setGameMaster(true);
                }
            }
        };
        verifyMaster();
    }, []);


    useEffect(() => {
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
                socket.emit('getWord', { player1Words, player2Words }, (res) => {
                    console.log(res);
                    setGameData(res.data);
                    setNumberWord(res.data[0].wordsNumber)
                    setCountdown(res.data[0].chrono)

                })
                return socket.off('getWord');

            } catch (error) {
                console.log(error);
            }
        };
        getWords(numWordsPerRound, [])
        
        
    }, [numWordsPerRound])



    const getWords_2 = async (numWords, usedWords) => {
        numWords = numberWord
        usedWords = []
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
            const player1Words = await newWords.slice(0, numWords / 2).map(word => ({ word, status: 0 }));
            const player2Words = await newWords.slice(numWords / 2, numWords).map(word => ({ word, status: 0 }));
   
            socket.emit('regenList', { player1Words, player2Words }, async (res) => {
                if (res.success) {
                    setGameData(res.data);
                    socket.emit('getDataGame', (res) => {                   
                        if (res.success) {
                            console.log(res.data);
                            setGameData(res.data);
                        }
                    })
                }
            })
            // await axiosBase.post("/team/words", { player1Words, player2Words });
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    useEffect(() => {
    
        if (gameData) {
            setCountdown(gameData[0].chrono)
            setCurrentWordIndex(gameData[0].currentWordIndex)
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
            updatedGameData[0].currentWord = nextWord.word
            nextWord.status = 3
            updatedGameData[0].currentWordIndex = 0
            updatedGameData[0].currentPlayerNumber = 1
            updatedGameData[0].currentPlayerWordList = currentPlayerWordlist + 1
            updatedGameData[0].rounds = 2
            updatedGameData[0].currentAttempt = reponseSend + 1
            updatedGameData[0].points = teamScore + 1
            if (chronoRef.current) {
                chronoRef.current.reset();
            }
            socket.emit('getUpdate', { updatedGameData }, async (res) => {
                if (res.success) {
                console.log('updaterecu');
                    console.log(res.data);
                    setGameData(res.data)
                    setCountdown(res.data[0].chrono)               
                }
            })
         
        } else {
            if (currentWordIndex === currentPlayer.wordlist.length - 1 && updatedGameData[0].currentPlayerWordList === 2) {
                setTeamScore((prevScore) => prevScore + 1);
                setCurrentWordIndex((prevScore) => prevScore + 1)
                currentWord.status = 1;
                updatedGameData[0].currentAttempt = reponseSend + 1
                updatedGameData[0].points = teamScore + 1
                updatedGameData[0].currentWordIndex = currentWordIndex + 1
                if (chronoRef.current) {
                    chronoRef.current.reset();
                }
                socket.emit('getUpdate', {updatedGameData }, (res) => {
                   
                    if (res.success) {
                        console.log('updaterecu');
                        console.log(res.data);
                        setGameData(res.data)
                        setCountdown(res.data[0].chrono)
                       
                    }
                })
              
               
            } else {
                setTeamScore((prevScore) => prevScore + 1);
                setCurrentWordIndex((prevScore) => prevScore + 1)
                currentWord.status = 1;
                nextWord.status = 3
                updatedGameData[0].currentWord = nextWord
                updatedGameData[0].currentAttempt = reponseSend + 1
                updatedGameData[0].points = teamScore + 1
                updatedGameData[0].currentWordIndex = currentWordIndex + 1
                if (chronoRef.current) {
                    chronoRef.current.reset();
                }
                socket.emit('getUpdate', {updatedGameData }, (res) => {
                    if (res.success) {
                        console.log('updaterecu');
                        console.log(res.data);
                        setGameData(res.data)
                        setCountdown(res.data[0].chrono)                       
                    }
                })        
            }
          
        }
        if (clicCounter === numWordsPerRound) {
            socket.emit('getUpdate', { updatedGameData }, (res) => {
                if (res.success) {
                    socket.emit('endGame', (res) => {
                        if (res.success) {
                            navigate('/recap');
                        }
                    })
                }
            })
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
            updatedGameData[0].currentWord = nextWord.word
            nextWord.status = 3
            updatedGameData[0].currentWordIndex = 0
            updatedGameData[0].currentPlayerNumber = 1
            updatedGameData[0].currentPlayerWordList = currentPlayerWordlist + 1
            updatedGameData[0].rounds = 2
            updatedGameData[0].currentAttempt = reponseSend + 1
            if (chronoRef.current) {
                chronoRef.current.reset();
            }

            socket.emit('getUpdate', { updatedGameData }, (res) => {
                if (res.success) {
                    console.log('updaterecu');
                console.log(res.data);
                    setGameData(res.data)
                    setCountdown(res.data[0].chrono)             
                }
            })
         
        } else {
            if (currentWordIndex === currentPlayer.wordlist.length - 1 && updatedGameData[0].currentPlayerWordList === 2) {
                setCurrentWordIndex((prevScore) => prevScore + 1)
                currentWord.status = 2;
                updatedGameData[0].currentAttempt = reponseSend + 1
                updatedGameData[0].currentWordIndex = currentWordIndex + 1
                if (chronoRef.current) {
                    chronoRef.current.reset();
                }

                socket.emit('getUpdate', {updatedGameData }, (res) => {
                    if (res.success) {
                        console.log('updaterecu');
                        console.log(res.data);
                        setGameData(res.data)
                        setCountdown(res.data[0].chrono)
                       
                    }
                })
               
            } else {
                setCurrentWordIndex((prevScore) => prevScore + 1)
                currentWord.status = 2;
                nextWord.status = 3
                updatedGameData[0].currentWord = nextWord
                updatedGameData[0].currentAttempt = reponseSend + 1
                updatedGameData[0].currentWordIndex = currentWordIndex + 1
                if (chronoRef.current) {
                    chronoRef.current.reset();
                }
                socket.emit('getUpdate', { updatedGameData }, (res) => {
                    if (res.success) {
                        console.log('updaterecu');
                        console.log(res.data);
                        setGameData(res.data)
                        setCountdown(res.data[0].chrono)
                        
                    }
                })
              
            }
        }
        if (clicCounter === numWordsPerRound) {
            socket.emit('getUpdate', { updatedGameData }, (res) => {
                if (res.success) {
                    socket.emit('endGame', (res) => {
                        if (res.success) {
                            navigate('/recap');
                        }
                    })
                }
            })
        }
    };



    const handleTimeout = () => {
        console.log('lala');
        // Logique à exécuter lorsque le chrono atteint 0
        // ...
    };

    const resetGame = async () => {
        try {
            socket.emit('teamReset', (response) => {
                if (response.success) {
                    navigate('/waitingroom');
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        socket.on('endgame', () => {
            navigate('/recap');
        });
    }, [navigate])



    return (
        <div className='GM-main'>
            {gamemaster ? (
                <><div>
                    <h1>ahmed mot de passe</h1>
                </div><div>
                        <h2 className='GM-round'>
                            Manche <span>{round}</span>
                        </h2>
                        <div className='GM-button-main'>
                            <div className='GM-button-reset-wrapper'><button className='GM-button-reset' onClick={resetGame}>Reset la game</button></div>
                            <div className='GM-button-regen-wrapper'><button className='GM-button-regen' onClick={getWords_2}>Regenerer une liste de mots</button></div>
                        </div>
                        <Chrono ref={chronoRef} onTimeout={handleTimeout} />
                        <div className='GM-TeamScore-main'>
                            <div className='GM-TeamScore'>
                                <p className='GM-TeamScore-point'>L'équipe a marqué : <span className='GM-TeamScore-point-span'>{teamScore}</span></p>
                            </div>
                            <div className='GM-btn-word'>
                                <div className='GM-btn-valide'>
                                    <button className='GM-btn-word-btn-valide' onClick={handleValiderMot} disabled={clicCounter === numWordsPerRound + 1}>Valider mot</button>
                                </div>
                                <div className='GM-btn-refuse'>
                                    <button className='GM-btn-word-btn-refuse' onClick={handleRefuserMot} disabled={clicCounter === numWordsPerRound + 1}>Refuser mot</button>
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
                                                                            : ''}`}
                                                    key={wordObj._id}
                                                >
                                                    {wordObj.word}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                        </div>
                    </div></>
            ) : (<div>
                <h2>Vous n'êtes pas GameMaster</h2>
            </div>
            )}
        </div>
    );
};

export default GameGM;

