import React, { useState } from 'react';
import axios from '../axiosConfig.js';

const LoginFormGameMaster = () => {
    const [login, setLogin] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [password, setPassword] = useState('');

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
                const response = await axios.post('/gamemaster/login', {pseudo: login, password });
                console.log( response.data);
                // Faites ici toute autre logique que vous souhaitez effectuer avec la réponse de la demande REST
            } catch (error) {
                console.error('Erreur veuillez reesayer');
            }
        } else {
            console.log('Login invalide');
        }
    };

    return (
        <form className='lfp_main' onSubmit={handleSubmit}>
            <div >
                <label className='lfp_main'>
                    Login du Game master
                    <input type="text" value={login} onChange={handleLoginChange} />
                    Mot de passe du Game master
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>
            </div>
            {!isValid && <p>Veuillez saisir un login contenant uniquement des caractères alphanumériques.</p>}
            <div>
                <button type="submit">Envoyer</button>
            </div>
        </form>
    );
};

export default LoginFormGameMaster;