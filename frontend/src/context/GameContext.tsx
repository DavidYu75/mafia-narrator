import { createContext, useContext, useState, ReactNode } from 'react';

// Define player interface
interface Player {
  id: number;
  name: string;
  imageData: string;
  role: string | null;
}

// Define context interface
interface GameContextType {
  playerCount: number;
  setPlayerCount: (count: number) => void;
  players: Player[];
  addPlayer: (player: Omit<Player, 'id'>) => void;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
  gameStarted: boolean;
  startGame: () => void;
  resetGame: () => void;
}

// Create context with default values
const GameContext = createContext<GameContextType>({
  playerCount: 0,
  setPlayerCount: () => {},
  players: [],
  addPlayer: () => {},
  currentPlayerIndex: 0,
  setCurrentPlayerIndex: () => {},
  gameStarted: false,
  startGame: () => {},
  resetGame: () => {},
});

// Create provider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [playerCount, setPlayerCount] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Add a new player
  const addPlayer = (player: Omit<Player, 'id'>) => {
    setPlayers([...players, { ...player, id: players.length }]);
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
  };

  // Reset the game
  const resetGame = () => {
    setPlayerCount(0);
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setGameStarted(false);
  };

  return (
    <GameContext.Provider
      value={{
        playerCount,
        setPlayerCount,
        players,
        addPlayer,
        currentPlayerIndex,
        setCurrentPlayerIndex,
        gameStarted,
        startGame,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => useContext(GameContext); 