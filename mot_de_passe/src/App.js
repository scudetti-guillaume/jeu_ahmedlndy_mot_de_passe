import LoginPlayers from './pages/loginPlayers';
import LoginGameMaster from './pages/loginGameMaster';
import Home from './pages/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style/index.scss';

function App() {
  return (
    <>
      {/* <BrowserRouter basename="/ahmed_jeu_mdp/">  */}
      <BrowserRouter >
        <Routes>
          <Route path="/players" element={<LoginPlayers />} />
          <Route path="/gameMaster" element={<LoginGameMaster />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
