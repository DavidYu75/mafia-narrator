import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import MainPage from './pages/MainPage';
import PlayerCountInput from './pages/PlayerCountInput';
import PlayerScanning from './pages/PlayerScanning';
import PlayerSummary from './pages/PlayerSummary';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/player-count" element={<PlayerCountInput />} />
          <Route path="/player-scan" element={<PlayerScanning />} />
          <Route path="/player-summary" element={<PlayerSummary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
