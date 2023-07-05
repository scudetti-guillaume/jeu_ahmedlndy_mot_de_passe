import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style/index.scss';
import Main from './pages/main';
import LoginPlayers from './pages/loginPlayers';
import LoginGameMaster from './pages/loginGameMaster';
import RegisterGameMaster from './pages/signupGameMaster';
import Waitingroom from './pages/waitingroom';
import GamePlayer from './pages/gamePlayers';
import GameGM from './pages/gameGM';
import GameViewers from './pages/gameViewers';
import SummaryGame from './pages/summaryGame';
import ManageGame from './pages/manageGame';


function App() {
  return (
    <>
      {/* <BrowserRouter basename="/ahmed_jeu_mdp/">  */}
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/manageGame" element={<ManageGame />} />
          <Route path="/loginPlayer" element={<LoginPlayers />} />
          <Route path="/logingameMaster" element={<LoginGameMaster />} />
          <Route path="/registergamemaster" element={<RegisterGameMaster />} />
          <Route path="/waitingroom" element={<Waitingroom />} />
          <Route path="/gamePlayer" element={<GamePlayer />} />
          <Route path="/gameGM" element={<GameGM />} />
          <Route path="/gameViewers" element={<GameViewers />} />
          <Route path="/recap" element={<SummaryGame />} />
        
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
