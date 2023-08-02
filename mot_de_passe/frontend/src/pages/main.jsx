import React from 'react';
import { Link } from 'react-router-dom';

const Main = () => {
    return (
        <div className='M-main'>
            <h1 className='M-h1'> Bienvenue chez hamedLNDY</h1>
            <h2 className='M-h2-choice'>choissisez votre jeu :</h2>
            <div className='M-mdp'>
                <h2>mot de passe </h2>
                <p className='M-description'>Jouer a 2 et deviner a tour de role "le mot de passe" pour gagner </p>
                <Link to="/loginPlayer" className="redirectMDP">
                    <span>
                        S'enregistrer en tant que joueur
                    </span>
                </Link>
                <Link to="/registergamemaster" className="redirectMDP">
                    <span>
                        S'enregistrer en tant que GameMaster
                    </span>
                </Link>
                <Link to="/manageGame" className="redirectMDP">
                    <span>
                        Modifier les paramètres du jeu 
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default Main;