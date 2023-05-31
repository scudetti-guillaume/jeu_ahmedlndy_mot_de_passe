import Login from './page/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style/App.css';

function App() {
  return (
    <>
      {/* <BrowserRouter basename="/ahmed_jeu_mdp/">  */}
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
