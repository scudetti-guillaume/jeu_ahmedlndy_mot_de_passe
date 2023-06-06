import React, { useEffect, useState, useRef } from 'react';
import Chrono from '../components/chronoGM';
import axios from '../axiosConfig.js';
import { io } from 'socket.io-client';


const GameGM = () => {
    const chronoRef = useRef(null);
    const [round, setRound] = useState(1);
    const [teamScore, setTeamScore] = useState(0);
    const [playerDirection, setPlayerDirection] = useState(1);
    const [words, setWords] = useState([]);
    const numWordsPerRound = 6;
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

            // Select numWords randomly from the array
            const selectedWords = [];
            while (selectedWords.length < numWords && newWords.length > 0) {
                const randomIndex = Math.floor(Math.random() * newWords.length);
                const randomWord = newWords[randomIndex];
                selectedWords.push(randomWord);
                newWords.splice(randomIndex, 1);
            }

            // Divide selectedWords into two arrays
            const player1Words = selectedWords.slice(0, numWords / 2);
            const player2Words = selectedWords.slice(numWords / 2);
                
            // console.log("Player 1 words:", player1Words);
            // console.log("Player 2 words:", player2Words);
            axios.post("/team/words", { player1Words, player2Words }).then((doc) => {
                console.log(doc);
            })

            return selectedWords;
        } catch (error) {
            console.log(error);
            return [];
        }
    };


    const startRound = async () => {
        const newWords = await getFrenchWords(numWordsPerRound, words);
        setWords(newWords);
    };

    const handleValiderMot = () => {
        // Increment the team score by 1
        setTeamScore(prevScore => prevScore + 1);
        chronoRef.current.reset();
    };

    const handleRefuserMot = () => {
        chronoRef.current.reset();
        // TODO: Handle additional logic when a word is refused
    };


    useEffect(() => {
        startRound();
    }, []);
    
    const handleTimeout = () => {
        // Logique à exécuter lorsque le chrono atteint 0
        // ...
    };

    return (
        <div className='GM-main'>
            <div>
                <h1>ahmed mot de passe</h1>
            </div>
            <div>
                <h2>
                    Manche <span>{round}</span>
                </h2>
        
                <Chrono ref={chronoRef} initialTime={30} onTimeout={handleTimeout}  />
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
                    <div className={playerDirection === 1 ? '1' : '2'}>
                        <div>
                            <h3>Le pseudo</h3>
                        </div>
                        <ul>
                            {words.map((word, index) => (
                                <li key={index}>{word}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={playerDirection === 2 ? '2' : '1'}>
                        <div>
                            <h3>Le pseudo</h3>
                        </div>
                        <ul>
                            {words.map((word, index) => (
                                <li key={index}>{word}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameGM;
