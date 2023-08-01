import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket} from '../config.js';

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
            try {
                setError(null);
                socket.emit('loginGameMaster', { pseudo: login, password }, (response)=>{
                if (response.success) {
                console.log(response);
                    localStorage.setItem('user', response.data.user);
                    localStorage.setItem('pseudo', response.data.pseudo);
                    localStorage.setItem('role', response.data.role);
                    localStorage.setItem('token', response.data.token);
                    navigate('/waitingroom')
                }
                })

                // await axiosBase.post('/gamemaster/login', { pseudo: login, password })
                // .then((doc) => {
                //         localStorage.setItem('user', doc.data.user);
                //         localStorage.setItem('pseudo', doc.data.pseudo);
                //         localStorage.setItem('role', doc.data.role);
                //         localStorage.setItem('token', doc.data.token);
                //     });            
               
            } catch (error) {
                setError('Pseudo invalide.');
                console.error('Erreur veuillez reesayer');
            }
        } else {
            setError('Pseudo invalide.');
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
            {error && <p>{error}</p>}
            <div>
                <button type="submit">Envoyer</button>
            </div>
        </form>
    );
};

export default LoginFormGameMaster;