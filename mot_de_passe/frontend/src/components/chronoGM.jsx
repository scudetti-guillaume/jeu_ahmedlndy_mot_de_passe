import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import axios from '../axiosConfig.js';

const ChronoGM = ({ initialTime, onTimeout }, ref) => {
    const [countdown, setCountdown] = useState(initialTime);
    // const [countdownProgress, setCountdownProgress] = useState(countdown);
    const [isRunning, setIsRunning] = useState(false);
    // const socketRef = useRef(null);

    useEffect(() => {
    const getGameSetting = async () => {
        try {
            await axios.get('gamemaster/getGameSettings').then((doc) => {
            console.log(doc.data[0].chrono);
            setCountdown(doc.data[0].chrono)            
            })
        } catch (error) {
            console.log(error);
        }
    };
        getGameSetting()
    }, []);

    useEffect(()  => {
        // getGameSetting()
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
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
      
    };
    

    return (
        <div className='GM-Chrono'>
            <div className='GM-Chrono-countdown'>
                <p>Chrono: </p>
                <p className='GM-Chrono-countdown-seconde'>{countdown} secondes</p>
            </div>
            <div className='GM-btn-Chrono-wrapper'>
                <button className='GM-btn-chrono-start' onClick={handleStart} disabled={isRunning || countdown === 0}>
                    Start
                </button>
                <button className='GM-btn-chrono-stop' onClick={handlePause} disabled={!isRunning}>
                    Pause
                </button>
            </div>
        </div>
    );
};

export default forwardRef(ChronoGM);