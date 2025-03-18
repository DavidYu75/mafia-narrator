import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { initGame } from '../services/gameService';

const PlayerCountInput = () => {
  const [count, setCount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { setPlayerCount } = useGame();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCount(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const playerCount = parseInt(count);
    if (isNaN(playerCount) || playerCount <= 0) {
      setError('Please enter a valid number of players');
      return;
    }
    
    if (playerCount < 4) {
      setError('At least 4 players are required for a Mafia game');
      return;
    }
    
    if (playerCount > 20) {
      setError('Maximum 20 players allowed');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Initialize game with backend
      const success = await initGame(playerCount);
      
      if (success) {
        // Update context
        setPlayerCount(playerCount);
        
        // Navigate to player scanning
        navigate('/player-scan');
      } else {
        setError('Failed to initialize game. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Player Count</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerCount" className="block text-gray-700 text-sm font-medium mb-2">
              How many players will join the game?
            </label>
            <input
              id="playerCount"
              type="number"
              value={count}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter number of players"
              min="4"
              max="20"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !count}
              className={`px-6 py-2 rounded-md text-white ${
                isLoading || !count 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } transition-colors`}
            >
              {isLoading ? 'Loading...' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerCountInput; 