import React, { useState, useEffect } from 'react';
import { Champion } from '../../types';
import SearchInput from '../SearchInput';

interface SplashArtModeProps {
  champions: Champion[];
  answer: Champion;
  guesses: string[];
  onGuess: (guess: string) => void;
  gameComplete: boolean;
}

const SplashArtMode: React.FC<SplashArtModeProps> = ({
  champions,
  answer,
  guesses,
  onGuess,
  gameComplete
}) => {
  const [zoomLevel, setZoomLevel] = useState(400); // Start very zoomed in

  useEffect(() => {
    // Zoom out with each wrong guess
    const wrongGuesses = guesses.filter(guess => 
      guess.toLowerCase() !== answer.name.toLowerCase()
    ).length;
    
    // Start at 400% zoom, reduce by 50% each wrong guess, minimum 100%
    const newZoom = Math.max(100, 400 - (wrongGuesses * 50));
    setZoomLevel(newZoom);
  }, [guesses, answer]);

  const handleGuess = (championName: string) => {
    if (!gameComplete && !guesses.includes(championName)) {
      onGuess(championName);
    }
  };

  const isCorrectGuess = (guess: string) => {
    return guess.toLowerCase() === answer.name.toLowerCase();
  };

  const getImageStyle = () => {
    return {
      transform: `scale(${zoomLevel / 100})`,
      transformOrigin: 'center center',
    };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Splash Art Mode</h3>
          <p className="text-gray-600">Guess the champion by their splash art!</p>
          <p className="text-sm text-gray-500 mt-1">
            The image zooms out with each wrong guess
          </p>
        </div>

        {/* Splash Art Display */}
        <div className="flex justify-center mb-6">
          <div className="relative w-80 h-60 bg-gray-200 rounded-lg overflow-hidden border-4 border-gray-300">
            {answer.splashArt ? (
              <img 
                src={answer.splashArt}
                alt="Champion Splash Art"
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                style={getImageStyle()}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
                <div className="text-white text-6xl font-bold opacity-50">
                  ?
                </div>
              </div>
            )}
            
            {/* Zoom indicator */}
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {zoomLevel}%
            </div>
          </div>
        </div>

        {/* Search Input */}
        <SearchInput
          suggestions={champions.map(c => c.name)}
          onSubmit={handleGuess}
          placeholder="Enter champion name..."
          disabled={gameComplete}
        />

        {/* Zoom Progress Indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Zoomed In</span>
            <span>Zoomed Out</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((400 - zoomLevel) / 300) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Guesses List */}
      {guesses.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-700 mb-3">Your Guesses:</h3>
          <div className="space-y-2">
            {guesses.map((guess, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 animate-slide-up ${
                  isCorrectGuess(guess)
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-red-100 border-red-500 text-red-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{guess}</span>
                  {isCorrectGuess(guess) ? (
                    <span className="text-green-600">✓ Correct!</span>
                  ) : (
                    <span className="text-red-600">✗ Wrong</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Complete Message */}
      {gameComplete && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <h4 className="text-xl font-semibold text-green-800 mb-2">
            Congratulations! 🎉
          </h4>
          <p className="text-green-700">
            The answer was <strong>{answer.name}</strong>
          </p>
          <p className="text-sm text-green-600 mt-2">
            You guessed it in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
          </p>
        </div>
      )}

      {/* Reveal Answer After Max Guesses */}
      {!gameComplete && guesses.length >= 6 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <h4 className="text-xl font-semibold text-yellow-800 mb-2">
            Game Over!
          </h4>
          <p className="text-yellow-700">
            The answer was <strong>{answer.name}</strong>
          </p>
          <p className="text-sm text-yellow-600 mt-2">
            Better luck next time!
          </p>
        </div>
      )}
    </div>
  );
};

export default SplashArtMode;