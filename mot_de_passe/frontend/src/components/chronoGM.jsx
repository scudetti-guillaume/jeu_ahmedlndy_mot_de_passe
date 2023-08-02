import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { socket} from '../config.js';

const ChronoGM = ({ initialTime, onTimeout }, ref) => {
   const [resetChrono, setResetChrono] = useState('')
    const [countdown, setCountdown] = useState(initialTime);
    // const [countdownProgress, setCountdownProgress] = useState(countdown);
    const [isRunning, setIsRunning] = useState(false);
    // const socketRef = useRef(null);

    useEffect(() => {
    const getGameSetting = async () => {
        try {
            socket.emit('getDataGame', async (response) => {
                if (response.success) {
                    setResetChrono(response.data[0].chrono)
                    setCountdown(response.data[0].chrono)
                }
            })
            
        } catch (error) {
            console.log(error);
        }
    };
        getGameSetting()
    },[]);

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
        socket.emit('getChrono', { chrono: countdown }, (response) => {

        })
    
        // axiosBase.post("/team/chrono", { chrono: countdown });    
        return () => {        
            clearInterval(timer);
        };
    }, [countdown, isRunning, onTimeout]);

    useImperativeHandle(ref, () => ({
        reset() {     
            setCountdown(resetChrono);
            setIsRunning(false);
        },
    }));

    const handleStart = () => {
    console.log('chronostart');
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
      
    };
    

    return (
        <div className='GM-Chrono'>
            <div className='GM-Chrono-countdown'>
                <p>Chrono: </p>
                <p className='GM-Chrono-countdown-seconde' initialTime={resetChrono} >{countdown} secondes</p>
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