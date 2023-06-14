import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from '../axiosConfig.js';

const ChronoGM = ({ initialTime, onTimeout }, ref) => {
    const [countdown, setCountdown] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const socketRef = useRef(null);


    useEffect(()  => {
        let timer;

        if (isRunning) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown === 1) {
                        clearInterval(timer);
                        setIsRunning(false);
                        onTimeout();
                    }
                    return prevCountdown - 1;
                });
             
            }, 1000);
            
            
        }
        axios.post("/team/chrono", { chrono: countdown });
       
        return () => {
         
            clearInterval(timer);
        };
    }, [countdown, isRunning, onTimeout]);

    useImperativeHandle(ref, () => ({
        reset() {
            setCountdown(initialTime);
            setIsRunning(false);
        },
    }));

    const handleStart = () => {
        // const socket = io(`http://localhost:4000`)
        // socket.emit('countdown', countdown);
        // console.log(countdown);
        setIsRunning(true);
    };

    const handlePause = () => {
        // const socket = io(`http://localhost:4000`)
        // socket.emit('countdown', countdown);
        // console.log(countdown);
        setIsRunning(false);
      
    };
    
    // useEffect(() => {
    //     const socket = io(`http://localhost:4000`) // Initialisation du socket

    //     return () => {
    //         socket.disconnect(); // Déconnexion du socket lors du démontage du composant
    //     };
    // }, []);
    
    // useEffect(() => {
    //     const socket = io(`http://localhost:4000`)
    //     let timer;
    //     socket.emit('countdown', countdown);
    //     console.log(countdown);
    //     if (isRunning) {
    //         timer = setInterval(() => {
    //             setCountdown(prevCountdown => {
    //                 if (prevCountdown === 1) {
    //                     clearInterval(timer);
    //                     setIsRunning(false);
    //                     onTimeout();
    //                 }
    //                 return prevCountdown - 1;
    //             });
    //         }, 1000);
    //     }

    //     // socketRef.current.emit('countdown', countdown); // Ajout de cette ligne

    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, [isRunning, onTimeout, countdown]);
    
    return (
        <div className='Chrono-GM'>
            <div >
                <p>Chrono: </p>
                <p>{countdown} secondes</p>
            </div>
            <div>
                <button className='chronoGM-btn' onClick={handleStart} disabled={isRunning || countdown === 0}>
                    Start
                </button>
                <button className='chronoGM-btn' onClick={handlePause} disabled={!isRunning}>
                    Pause
                </button>
            </div>
        </div>
    );
};

export default forwardRef(ChronoGM);