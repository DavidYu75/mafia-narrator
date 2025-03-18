import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useGame } from '../context/GameContext';
import { registerPlayer } from '../services/gameService';

// Component states
enum ScanState {
  INSTRUCTIONS,
  CAMERA_READY,
  CAPTURE_COMPLETE,
  NAME_INPUT,
  ROLE_DISPLAY,
}

const PlayerScanning = () => {
  const [scanState, setScanState] = useState<ScanState>(ScanState.INSTRUCTIONS);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [assignedRole, setAssignedRole] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();
  
  const { 
    playerCount, 
    addPlayer, 
    currentPlayerIndex, 
    setCurrentPlayerIndex 
  } = useGame();

  // Handle starting the scanning process
  const handleStartScan = () => {
    setScanState(ScanState.CAMERA_READY);
  };

  // Capture the current frame from webcam
  const captureImage = useCallback(() => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setScanState(ScanState.CAPTURE_COMPLETE);
    } else {
      setError('Failed to capture image. Please try again.');
    }
  }, [webcamRef]);

  // Retake the photo
  const handleRetake = () => {
    setCapturedImage(null);
    setScanState(ScanState.CAMERA_READY);
  };

  // Confirm the captured photo and proceed to name input
  const handleConfirmImage = () => {
    setScanState(ScanState.NAME_INPUT);
  };

  // Handle player name submission
  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter a name');
      return;
    }
    
    if (!capturedImage) {
      setError('No image captured. Please try again.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register player with backend
      const role = await registerPlayer({
        name: playerName,
        imageData: capturedImage,
      });
      
      if (role) {
        // Add player to context
        addPlayer({
          name: playerName,
          imageData: capturedImage,
          role: role,
        });
        
        // Display role to player
        setAssignedRole(role);
        setScanState(ScanState.ROLE_DISPLAY);
      } else {
        setError('Failed to assign role. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle proceeding to next player
  const handleNextPlayer = () => {
    // Reset state for next player
    setCapturedImage(null);
    setPlayerName('');
    setAssignedRole(null);
    setError('');
    
    // Check if all players are registered
    if (currentPlayerIndex + 1 >= playerCount) {
      // Navigate to player summary
      navigate('/player-summary');
    } else {
      // Move to next player
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setScanState(ScanState.INSTRUCTIONS);
    }
  };

  // Render different content based on scan state
  const renderContent = () => {
    switch (scanState) {
      case ScanState.INSTRUCTIONS:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Player {currentPlayerIndex + 1} of {playerCount}
            </h2>
            <p className="mb-6 text-gray-600">
              The camera will take a picture of your face for player identification.
              Please ensure your face is clearly visible and well-lit.
            </p>
            <button
              onClick={handleStartScan}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Start Scan
            </button>
          </div>
        );
        
      case ScanState.CAMERA_READY:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Player {currentPlayerIndex + 1} of {playerCount}
            </h2>
            <div className="border-4 border-gray-300 rounded-md overflow-hidden mx-auto">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 480,
                  height: 360,
                  facingMode: "user"
                }}
                className="mx-auto"
              />
            </div>
            {error && <p className="text-red-600 text-center">{error}</p>}
            <div className="flex justify-center">
              <button
                onClick={captureImage}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Capture
              </button>
            </div>
          </div>
        );
        
      case ScanState.CAPTURE_COMPLETE:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Review Captured Image
            </h2>
            {capturedImage && (
              <div className="border-4 border-gray-300 rounded-md overflow-hidden mx-auto">
                <img src={capturedImage} alt="Captured" className="mx-auto" />
              </div>
            )}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRetake}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Retake
              </button>
              <button
                onClick={handleConfirmImage}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        );
        
      case ScanState.NAME_INPUT:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Enter Your Name
            </h2>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-gray-700 text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your name"
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md text-white ${
                    isLoading 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } transition-colors`}
                >
                  {isLoading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        );
        
      case ScanState.ROLE_DISPLAY:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold mb-2">Your Role</h2>
            
            <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300 mx-auto max-w-xs">
              <p className="text-4xl font-bold text-indigo-700">{assignedRole}</p>
            </div>
            
            <p className="italic text-gray-600">
              Remember your role and keep it secret from other players.
            </p>
            
            <button
              onClick={handleNextPlayer}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mt-4"
            >
              {currentPlayerIndex + 1 >= playerCount ? 'View Summary' : 'Next Player'}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default PlayerScanning; 