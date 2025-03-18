import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/player-count');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Mafia Game Narrator</h1>
        
        <div className="my-8">
          <p className="text-gray-600 mb-4">
            Welcome to the Mafia Game Narrator system! This application will help you run 
            in-person Mafia games by managing player roles, game state, and announcements.
          </p>
          <p className="text-gray-600 mb-4">
            The narrator will handle player tracking, role assignments, and game flow,
            allowing you to focus on the social deduction aspects of the game.
          </p>
        </div>
        
        <button 
          onClick={handleStart}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default MainPage; 