import React from 'react';
import LoginFormPlayer from '../components/loginFormPlayers';

const loginPlayers = () => {
    return (
        <div className='lp_Main'>
            <h1>AhmedLndy</h1>
            <h2>mot de passe</h2>
            <h3>Connection des joueurs</h3>
            <LoginFormPlayer />
        </div>
    );
};

export default loginPlayers;