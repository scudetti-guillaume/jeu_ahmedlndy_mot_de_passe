import React, { useEffect, useState, useRef } from 'react';
import Chrono from '../components/chronoGM';
import axios from '../axiosConfig.js';
import { io } from 'socket.io-client';

const GameGM = () => {
    const chronoRef = useRef(null);
    const [round, setRound] = useState(1);
    const [teamScore, setTeamScore] = useState(0);
    const [playerDirection, setPlayerDirection] = useState(1);
    const [words, setWords] = useState({ player1Words: [], player2Words: [] });
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(1);
    const [currentPlayerWords, setCurrentPlayerWords] = useState(words.player1Words);
    const numWordsPerRound = 12;
    const numWordsPerRound_2 = 12;
    const numRounds = 2;


    const getFrenchWords = async (numWords, usedWords) => {
        try {
            const response = await fetch(`https://api.datamuse.com/words?ml=fr&max=1000`);
            const data = await response.json();
            const frenchWords = data
                .filter(word => word.tags && !word.tags.includes("conj"))
                .filter(word => word.word.match(/^[a-zA-ZÀ-ÿ]{6,}$/))
                .map(word => word.word.toLowerCase());
            const newWords = frenchWords.filter(word => !usedWords.includes(word));
            for (let i = newWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newWords[i], newWords[j]] = [newWords[j], newWords[i]];
            }
            const player1Words = newWords.slice(0, numWords / 2);
            const player2Words = newWords.slice(numWords / 2, numWords);
            await axios.post("/team/words", { player1Words, player2Words });
            await axios.get("/team/getWords").then((doc) => {
                setWords({ player1Words: doc.data.list_1, player2Words: doc.data.list_2 });
            });
            return [player1Words, player2Words];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const regenWords = async (numWords, usedWords) => {
        try {
            await axios.patch("/team/regenwords")
            const response = await fetch(`https://api.datamuse.com/words?ml=fr&max=1000`);
            const data = await response.json();
            const frenchWords = data
                .filter(word => word.tags && !word.tags.includes("conj"))
                .filter(word => word.word.match(/^[a-zA-ZÀ-ÿ]{6,}$/))
                .map(word => word.word.toLowerCase());
            const newWords = frenchWords.filter(word => !usedWords.includes(word));
            for (let i = newWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newWords[i], newWords[j]] = [newWords[j], newWords[i]];
            }
            const player1Words = newWords.slice(0, numWords / 2);
            const player2Words = newWords.slice(numWords / 2, numWords);
            await axios.post("/team/words", { player1Words, player2Words });
            await axios.get("/team/getWords").then((doc) => {
                setWords({ player1Words: doc.data.list_1, player2Words: doc.data.list_2 });
            });
            return [player1Words, player2Words];
        } catch (error) {
            console.log(error);
            return [];
        }
    }


    const regenWordList = async () => {
        const [player1Words, player2Words] = await regenWords(numWordsPerRound_2, words.player1Words.concat(words.player2Words));
        setWords({ player1Words: player1Words, player2Words: player2Words });
        setCurrentWordIndex(0);
        setCurrentWord(player1Words[0]);
        setPlayerDirection(1);
    };;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const startRound = async () => {
        const [player1Words, player2Words] = await getFrenchWords(numWordsPerRound, words.player1Words.concat(words.player2Words));
        setWords({ player1Words: player1Words, player2Words: player2Words });
        setCurrentWordIndex(0);
        setCurrentWord(player1Words[0]);
        setPlayerDirection(1);
    };

    const handleValiderMot = () => {
        if (currentWordIndex === words.player1Words.length - 1) {
            setCurrentWordIndex(0);
            setPlayerDirection(2);
        } else {
            setCurrentWordIndex(prevIndex => prevIndex + 1);
        }
        setTeamScore(prevScore => prevScore + 1);
        axios.post("/team/update", { teamScore });
        chronoRef.current.reset();
    };

    const handleRefuserMot = () => {
        if (currentWordIndex === words.player1Words.length - 1) {
            setCurrentWordIndex(0);
            setPlayerDirection(2);
        } else {
            setCurrentWordIndex(prevIndex => prevIndex + 1);
        }
        chronoRef.current.reset();
    };;


    const handleTimeout = () => {
        // Logique à exécuter lorsque le chrono atteint 0
        // ...
    };
    useEffect(() => {
        startRound();
    }, []);

    useEffect(() => {
        if (currentWordIndex >= 0) {
            setCurrentWord(
                playerDirection === 1
                    ? words.player1Words[currentWordIndex]
                    : words.player2Words[currentWordIndex]
            );
        }
    }, [currentWordIndex, playerDirection, words]);

    // useEffect(() => {
    //     setCurrentWord(words.player1Words[currentWordIndex]);
    //     setCurrentWordIndex(prevIndex => prevIndex + 1);
    //     console.log(currentWordIndex);
    //     console.log(currentWord);

    // }, [currentWord, currentWordIndex, words.player1Words]);

    return (
        <div className='GM-main'>
            <div>
                <h1>ahmed mot de passe</h1>
            </div>

            <div>
                <h2>
                    Manche <span>{round}</span>
                </h2>
                <div><button onClick={regenWordList}>Regenerer une liste les mots </button></div>
                <Chrono ref={chronoRef} initialTime={30} onTimeout={handleTimeout} />
                <div className='GM-TeamScore-main'>
                    <div className='GM-TeamScore'>
                        <p>L'équipe a marqué : <span>{teamScore}</span></p>
                    </div>
                    <div className='GM-btn-word'>
                        <div>
                            <button className='GM-btn-word-btn-valide' onClick={handleValiderMot}>Valider mot</button>
                        </div>
                        <div>
                            <button className='GM-btn-word-btn-refuse' onClick={handleRefuserMot}>Refuser mot</button>
                        </div>
                    </div>
                </div>
                <div>
                    Mot actuel: {currentWord}
                </div>
                <div className='GM-player-main'>
                    <div>
                        <div className='GM-ul-player'>Pseudo : player 1</div>
                        <div className='GM-li-player' >
                            {words.player1Words && words.player1Words.map((word, index) => (
                                <span
                                    key={index}
                                    style={{
                                        border: playerDirection === 1 && index === currentWordIndex ? '2px solid green' : 'none',
                                        color: playerDirection === 1 && index < currentWordIndex ? 'green' : 'white',
                                    }}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className='GM-ul-player'>Pseudo : player 2</div>
                        <div className='GM-li-player' >
                            {words.player2Words && words.player2Words.map((word, index) => (
                                <span
                                    key={index}
                                    style={{
                                        border: playerDirection === 2 && index === currentWordIndex ? '2px solid green' : 'none',
                                        color: playerDirection === 2 && index < currentWordIndex ? 'green' : 'white',
                                    }}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                       
                    </div>
                    
                </div>
               
            </div>
        </div>
    );
};

export default GameGM;
