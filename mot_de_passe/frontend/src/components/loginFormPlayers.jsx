import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket} from '../config.js';

const LoginFormPlayer = () => {
    const [login, setLogin] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState(null);
    // const [user, setUser] = useState([])

    const navigate = useNavigate(); // Use useNavigate to get the navigate function

    const handleLoginChange = (event) => {
        const inputValue = event.target.value;
        setLogin(inputValue);
        setIsValid(/^[a-zA-Z0-9]+$/.test(inputValue));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isValid) {
            setError(null);
            console.log(login);

            // Utiliser socket.emit pour envoyer une demande au serveur
            socket.emit('register', { pseudo: login }, (response) => {
                if (response.success) {
                    localStorage.setItem('user', response.user._id);
                    localStorage.setItem('pseudo', response.user.pseudo);
                    localStorage.setItem('role', response.user.role);
                    // localStorage.setItem('token', response.user.token);
                    console.log(response);
                    navigate('/waitingroom'); // Utiliser navigate pour naviguer vers '/waitingroom'
                } else {
                    setError('Pseudo invalide.');
                }
            });
        } else {
            setError('Pseudo invalide.');
        }
    };



    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     if (isValid) {
    //         try {
    //             setError(null);
    //             console.log('la');
    //             console.log(login);
    //             await axiosBase.post('/player/register', { pseudo: login })
    //                 .then((doc) => {
    //                     setUser(doc.data);
    //                     localStorage.setItem('user', doc.data.user);
    //                     localStorage.setItem('pseudo', doc.data.pseudo);
    //                     localStorage.setItem('role', doc.data.role);
    //                     localStorage.setItem('token', doc.data.token);
    //                     console.log(doc);
    //                 }).then(() => {                  
    //                     socket.emit('newlogin',{user});      
    //                     navigate('/waitingroom'); // Use navigate to navigate to '/waitingroom'
    //                 });
    //         } catch (error) {
    //             setError('Pseudo invalide.');
    //         }
    //     } else {
    //         setError('Pseudo invalide.');
    //     }
    // };

    return (
        
        <form className='lfp_main' onSubmit={handleSubmit} >
            <div>
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