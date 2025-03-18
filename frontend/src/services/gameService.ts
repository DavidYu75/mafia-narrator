// Base API URL - can be changed for production
const API_URL = 'http://localhost:8000';

// Define interfaces for API responses and requests
interface PlayerData {
  name: string;
  imageData: string;
}

// Initialize a new game with player count
export const initGame = async (playerCount: number): Promise<boolean> => {
  try {
    // In a real implementation, this would call the backend
    // For now, we'll simulate a successful response
    console.log(`Initializing game with ${playerCount} players`);
    return true;
  } catch (error) {
    console.error('Error initializing game:', error);
    return false;
  }
};

// Register a player
export const registerPlayer = async (playerData: PlayerData): Promise<string | null> => {
  try {
    // In a real implementation, this would send the player data to the backend
    // For now, we'll simulate role assignment
    console.log(`Registering player: ${playerData.name}`);
    
    // Simulate role assignment - in a real app, this would come from the backend
    const roles = ['Villager', 'Werewolf', 'Seer', 'Doctor', 'Mafia'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    
    return randomRole;
  } catch (error) {
    console.error('Error registering player:', error);
    return null;
  }
};

// Get a role for a player
export const getRole = async (playerIndex: number): Promise<string | null> => {
  try {
    // In a real implementation, this would fetch the role from the backend
    console.log(`Getting role for player #${playerIndex}`);
    return null;
  } catch (error) {
    console.error('Error getting role:', error);
    return null;
  }
};

// Start the game
export const startGame = async (gameId: string): Promise<boolean> => {
  try {
    // In a real implementation, this would start the game in the backend
    console.log(`Starting game: ${gameId}`);
    return true;
  } catch (error) {
    console.error('Error starting game:', error);
    return false;
  }
}; 