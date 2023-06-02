import LoginPlayers from './pages/loginPlayers';
import LoginGameMaster from './pages/loginGameMaster';
import RegisterGameMaster from './pages/signupGameMaster';
import Home from './pages/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style/index.scss';

function App() {
  return (
    <>
      {/* <BrowserRouter basename="/ahmed_jeu_mdp/">  */}
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<LoginPlayers />} />
          <Route path="/logingameMaster" element={<LoginGameMaster />} />
          <Route path="/registergamemaster" element={<RegisterGameMaster />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
