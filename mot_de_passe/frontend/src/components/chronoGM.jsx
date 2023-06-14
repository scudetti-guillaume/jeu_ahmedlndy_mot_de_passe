import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { io } from 'socket.io-client';

const ChronoGM = ({ initialTime, onTimeout }, ref) => {
    const [countdown, setCountdown] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const socket = io(`http://localhost:4000`)


    useEffect(() => {
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

        return () => {
            clearInterval(timer);
        };
    }, [isRunning, onTimeout]);

    useImperativeHandle(ref, () => ({
        reset() {
            setCountdown(initialTime);
            setIsRunning(false);
        },
    }));

    const handleStart = () => {
        socket.emit('startChrono');
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
        socket.emit('chronoTimeout');
    };
    
    useEffect(() => {
        socket.on('startChrono', () => {
            setIsRunning(true);
        });

        return () => {
            socket.off('startChrono');
        };
    }, []);
    
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