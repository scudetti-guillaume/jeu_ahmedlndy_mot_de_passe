
import React, { useEffect, useState } from 'react';

const GamePlayers = () => {
    const [round, setRound] = useState(1);
    const [teamScore, setTeamScore] = useState(0);
    const [countdown, setCountdown] = useState(30);
    const [playerDirection, setPlayerDirection] = useState(1);
    const [words, setWords] = useState([]);

    const numWordsPerRound = 12;
    const numRounds = 2;

    const getFrenchWords = async (numWords, usedWords) => {
        try {
            const response = await fetch(`https://api.datamuse.com/words?ml=fr&max=1000`);
            const data = await response.json();
            const frenchWords = data
                .filter(word => word.tags && !word.tags.includes("conj"))
                .filter(word => word.word.match(/^[a-zA-ZÀ-ÿ]{6,}$/)) // Filter words to keep only French alphabetical characters with a minimum length of 6
                .map(word => word.word.toLowerCase()); // Convert all words to lowercase

            const newWords = frenchWords.filter(word => !usedWords.includes(word));
            console.log(newWords);
            
            return newWords.slice(0, numWords);
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const startRound = async () => {
        const newWords = await getFrenchWords(numWordsPerRound, words);
        setWords(newWords);
    };

    useEffect(() => {
        startRound();
    }, []);

    return (
        <div className='GP-main'>
            <div>
                <h1>hamed mot de passe</h1>
            </div>
            <div>
                <h2>
                    Manche <span>{round}</span>
                </h2>
                <div>
                    <p>Votre équipe a marqué : <span>{teamScore}</span></p>
                </div>
                <div>
                    <p>Chrono</p>
                    <span>{countdown} secondes</span>
                </div>
                <div className={playerDirection === 1 ? '1' : '2'}>
                    <div>
                        Pseudo : Vous devez faire deviner les mots
                    </div>
                    <div>
                        <h3>Le pseudo</h3>
                    </div>
                    <ul>
                        {words.map((word, index) => (
                            <li key={index}>{word}</li>
                        ))}
                    </ul>
                </div>
                <div className={playerDirection === 1 ? '2' : '1'}>
                    <div>
                        Pseudo : Vous devez deviner les mots
                    </div>
                    <div>
                        <h3>Le pseudo</h3>
                    </div>
                    <ul>
                        <li></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GamePlayers;