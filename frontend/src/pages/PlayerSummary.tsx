import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { startGame } from '../services/gameService';

const PlayerSummary = () => {
  const navigate = useNavigate();
  const { players, startGame: contextStartGame } = useGame();
  
  const handleStartGame = async () => {
    try {
      // Call the API to start the game
      const success = await startGame('game-id-123'); // In a real app, use a proper ID
      
      if (success) {
        // Update game state in context
        contextStartGame();
        
        // Navigate to game play screen (to be implemented)
        // For now, just go back to main page
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Player Summary</h1>
        
        {players.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No players have been registered yet.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Back to Start
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {players.map((player) => (
                <div key={player.id} className="border border-gray-200 rounded-md p-4 flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                    <img 
                      src={player.imageData} 
                      alt={player.name}
                      className="w-full h-full object-cover"  
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{player.name}</h3>
                    <p className="text-sm text-gray-500">Player #{player.id + 1}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                onClick={() => navigate('/player-scan')}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={handleStartGame}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Start Game
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerSummary; 