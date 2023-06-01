import React, { useState } from 'react';

const LoginFormPlayer = () => {
    const [login, setLogin] = useState('');
    const [isValid, setIsValid] = useState(true);

    const handleLoginChange = (event) => {
        const inputValue = event.target.value;
        setLogin(inputValue);
        setIsValid(/^[a-zA-Z0-9]+$/.test(inputValue));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isValid) {
            // Envoyer la demande REST avec le login du joueur
            console.log('Login valide :', login);
            // Faites ici votre appel REST ou toute autre logique que vous souhaitez effectuer avec les données du formulaire
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
