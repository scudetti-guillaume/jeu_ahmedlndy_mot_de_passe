import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style/index.scss';
import LoginPlayers from './pages/loginPlayers';
import LoginGameMaster from './pages/loginGameMaster';
import RegisterGameMaster from './pages/signupGameMaster';
import Waitingroom from './pages/waitingroom';
import Game from './pages/game';


function App() {
  return (
    <>
      {/* <BrowserRouter basename="/ahmed_jeu_mdp/">  */}
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<LoginPlayers />} />
          <Route path="/logingameMaster" element={<LoginGameMaster />} />
          <Route path="/registergamemaster" element={<RegisterGameMaster />} />
          <Route path="/waitingroom" element={<Waitingroom />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
