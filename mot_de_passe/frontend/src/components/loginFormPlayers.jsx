import React, { useState } from 'react';
import axios from '../axiosConfig.js';

const LoginFormPlayer = () => {
    const [login, setLogin] = useState('');
    const [isValid, setIsValid] = useState(true);

    const handleLoginChange = (event) => {
        const inputValue = event.target.value;
        setLogin(inputValue);
        setIsValid(/^[a-zA-Z0-9]+$/.test(inputValue));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isValid) {
            try {
                const response = await axios.post('/player/register', { pseudo: login });
                console.log(response.data);
                window.location.href = '/home';
            } catch (error) {
                console.log('Erreur veuillez reesayer');
            }
        } else {
            console.log('Login invalide');
        }
    };

    return (
        <form className='lfp_main' onSubmit={handleSubmit}>
            <div >
                <label className='lfp_main'>
                    Login du joueur:
                    <input type="text" value={login} onChange={handleLoginChange} />
                </label>
            </div>
            {!isValid && <p>Veuillez saisir un login contenant uniquement des caractères alphanumériques.</p>}
            <div>
                <button type="submit">Envoyer</button>
            </div>
        </form>
    );
};

export default LoginFormPlayer;
