import React, { useState } from 'react';
import axios from '../axiosConfig.js';

const LoginFormGameMaster = () => {
    const [login, setLogin] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLoginChange = (event) => {
        const inputValue = event.target.value;
        setLogin(inputValue);
        setIsValid(/^[a-zA-Z0-9]+$/.test(inputValue));
    };

    const handlePasswordChange = (event) => {
        const inputValue = event.target.value;
        setPassword(inputValue);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isValid) {
            try {
                await axios.post('/gamemaster/register', { pseudo: login, password , role : "gameMaster" });
                window.location.href = '/logingamemaster';
            } catch (error) {
                setError('Pseudo ou mot de passe invalide');
                console.log('Erreur veuillez reesayer');
            }
        } else {
            setError('Pseudo ou mot de passe invalide');
            console.log('Login invalide');
        }
    };

    return (
        <form className='lfp_main' onSubmit={handleSubmit}>
            <div >
                <label className='sufp_main'>
                    Login du Game master
                    <input type="text" value={login} onChange={handleLoginChange} />
                    Mot de passe du Game master
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>
            </div>
            {!isValid && <p>Veuillez saisir un login contenant uniquement des caractères alphanumériques.</p>}
            {error && <p>{error}</p>}
            <div>
                <button type="submit">Envoyer</button>
            </div>
        </form>
    );
};

export default LoginFormGameMaster;