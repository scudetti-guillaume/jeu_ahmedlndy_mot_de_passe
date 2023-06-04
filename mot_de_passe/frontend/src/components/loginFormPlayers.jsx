import React, { useState,} from 'react';
import axios from '../axiosConfig.js';


const LoginFormPlayer = () => {
    const [login, setLogin] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState(null);
    
    
    
    const handleLoginChange = (event) => {
        const inputValue = event.target.value;
        setLogin(inputValue);
        setIsValid(/^[a-zA-Z0-9]+$/.test(inputValue));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isValid) {
            try {
                setError(null);
                await axios.post('/player/register', { pseudo: login })
                    .then((doc) => {
                        localStorage.setItem('user', doc.data.user);
                        localStorage.setItem('pseudo', doc.data.pseudo);
                        localStorage.setItem('role', doc.data.role);
                        localStorage.setItem('token', doc.data.token);
                    });
                window.location.href = '/waitingroom';
            } catch (error) {
                setError('Pseudo invalide.');
            }
        } else {
            setError('Pseudo invalide.');
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
            {error && <p>{error}</p>}
            <div>
                <button type="submit">Envoyer</button>
            </div>
        </form>
    );
};

export default LoginFormPlayer;
