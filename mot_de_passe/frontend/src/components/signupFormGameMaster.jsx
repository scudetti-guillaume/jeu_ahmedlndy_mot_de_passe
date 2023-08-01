import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../config.js';

const LoginFormGameMaster = () => {
    const navigate = useNavigate();
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
            socket.emit('registerGameMaster', { pseudo: login, password: password }, (res) => {
                if (res.success) {
                    console.log(res);
                    navigate('/logingamemaster');
                } else {
                    setError('Pseudo ou mot de passe invalide');
                    console.log('Erreur, veuillez réessayer');
                }
            });
        } else {
            setError('Pseudo ou mot de passe invalide');
            console.log('Login invalide');
        }
    };

    return (
        <form className='lfp_main' onSubmit={handleSubmit}>
            <div>
                <label className='sufp_main'>
                    Login du Game master
                    <input type="text" name="login" value={login} onChange={handleLoginChange} />
                </label>
                <label className='sufp_main'>
                    Mot de passe du Game master
                    <input type="password" name="password" value={password} onChange={handlePasswordChange} />
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