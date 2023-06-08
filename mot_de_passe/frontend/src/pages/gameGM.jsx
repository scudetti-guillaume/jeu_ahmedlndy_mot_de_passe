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
    const numWordsPerRound = 6;
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
            let list_1 = [];
            let list_2 = [];
            await axios.get("/team/getWords").then((doc) => {
                list_1 = doc.data.list_1;
                list_2 = doc.data.list_2;
            });
            setWords({ player1Words: list_1, player2Words: list_2 });
            return [[list_1], [list_2]];
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
            let list_1 = [];
            let list_2 = [];
            await axios.get("/team/getWords").then((doc) => {
                list_1 = doc.data.list_1;
                list_2 = doc.data.list_2;
            });
            setWords({ player1Words: list_1, player2Words: list_2 });

            return [[list_1], [list_2]];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const regenWordList = async () => {
        const { list_1, list_2 } = await regenWords(numWordsPerRound_2, words.player1Words.concat(words.player2Words));
        if (list_1 && list_2) {
            setWords({ player1Words: list_1, player2Words: list_2 });
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const startRound = async () => {
        const { list_1, list_2 } = await getFrenchWords(numWordsPerRound, words.player1Words.concat(words.player2Words));
        if (list_1 && list_2) {
            setWords({ player1Words: list_1, player2Words: list_2 });
        }
    };

    const handleValiderMot = () => {
        setCurrentWordIndex(prevIndex => prevIndex + 1);
        setTeamScore(prevScore => prevScore + 1);
        axios.post("/team/update", { teamScore });
        chronoRef.current.reset();
    };

    const handleRefuserMot = () => {
        setCurrentWordIndex(prevIndex => prevIndex + 1);
        chronoRef.current.reset();
    };


    const handleTimeout = () => {
        // Logique à exécuter lorsque le chrono atteint 0
        // ...
    };
    useEffect(() => {
        startRound();
    }, []);

    useEffect(() => {
        // startRound();
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
                <div className='GM-player-main'>
                    <div>
                        <div className='GM-ul-player'>Pseudo : player 1</div>
                        <div>
                            {words.player1Words && words.player1Words.map((wordList, index) => (
                                <li className='GM-ul-player' key={index}>
                                    {wordList.map((word, wordIndex) => (
                                        <div
                                            key={wordIndex}
                                            style={{
                                                border: index === currentWordIndex && playerDirection === 1 && wordIndex === 0 ? '2px solid green' : 'none',
                                                color: index < currentWordIndex ? 'green' : 'white',
                                            }}
                                        >
                                            {word}
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className='GM-ul-player'>Pseudo : player 2</div>
                        <div>

                            {words.player2Words && words.player2Words.map((wordList, index) => (
                                <li className='GM-ul-player' key={index}>
                                    {wordList.map((word, wordIndex) => (
                                        <div
                                            key={wordIndex}
                                            style={{
                                                border: index === currentWordIndex && playerDirection === 2 && wordIndex === 0 ? '2px solid green' : 'none',
                                                color: index < currentWordIndex ? 'green' : 'white',
                                            }}
                                        >
                                            {word}
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </div>
                        <div>
                            Mot actuel: {currentWord}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameGM;
