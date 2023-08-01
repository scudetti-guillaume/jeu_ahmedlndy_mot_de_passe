import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { socket} from '../config.js';

const ChronoGM = ({ initialTime, onTimeout }, ref) => {
    const [countdown, setCountdown] = useState(initialTime);
    // const [countdownProgress, setCountdownProgress] = useState(countdown);
    const [isRunning, setIsRunning] = useState(false);
    // const socketRef = useRef(null);

    useEffect(() => {
    const getGameSetting = async () => {
        try {
            socket.emit('getGameSettings', (response) => {
                if (response.success) {
                    setCountdown(response.data[0].chrono)
                }
            })

            // await axiosBase.get('gamemaster/getGameSettings').then((doc) => {
            // console.log(doc.data[0].chrono);
            // setCountdown(doc.data[0].chrono)            
            // })
        } catch (error) {
            console.log(error);
        }
    };
    
   
        getGameSetting()
    },);

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
            if (response.success) {
                console.log(response.data);
                setCountdown(response.data)
            }
        })
    
        // axiosBase.post("/team/chrono", { chrono: countdown });    
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