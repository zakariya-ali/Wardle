import React, { useState, useEffect } from 'react';
import { Ward } from '../../types';

interface WardModeProps {
  wards: Ward[];
  answer: Ward;
  guesses: string[];
  onGuess: (guess: string) => void;
  gameComplete: boolean;
}

const WardMode: React.FC<WardModeProps> = ({
  wards,
  answer,
  guesses,
  onGuess,
  gameComplete
}) => {
  const [zoomLevel, setZoomLevel] = useState(300); // Start zoomed in
  const [inputValue, setInputValue] = useState('');
  const [filteredWards, setFilteredWards] = useState<Ward[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Zoom out with each wrong guess
    const wrongGuesses = guesses.filter(guess => 
      guess.toLowerCase() !== answer.name.toLowerCase()
    ).length;
    
    // Start at 300% zoom, reduce by 40% each wrong guess, minimum 100%
    const newZoom = Math.max(100, 300 - (wrongGuesses * 40));
    setZoomLevel(newZoom);
  }, [guesses, answer]);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = wards.filter(ward =>
        ward.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredWards(filtered);
      setShowDropdown(true);
    } else {
      setFilteredWards([]);
      setShowDropdown(false);
    }
  }, [inputValue, wards]);

  const handleGuess = (wardName: string) => {
    if (!gameComplete && !guesses.includes(wardName)) {
      onGuess(wardName);
      setInputValue('');
      setShowDropdown(false);
    }
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      const exactMatch = wards.find(ward => 
        ward.name.toLowerCase() === inputValue.toLowerCase()
      );
      if (exactMatch) {
        handleGuess(exactMatch.name);
      }
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ward Mode</h3>
          <p className="text-gray-600">Guess the ward skin by its icon!</p>
          <p className="text-sm text-gray-500 mt-1">
            The image zooms out with each wrong guess
          </p>
        </div>

        {/* Ward Icon Display */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48 bg-gray-200 rounded-lg overflow-hidden border-4 border-gray-300">
            {answer.icon ? (
              <img 
                src={answer.icon}
                alt="Ward Icon"
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                style={getImageStyle()}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
                <div className="text-white text-6xl font-bold opacity-50">
                  👁
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
        {!gameComplete && (
          <div className="mb-6 relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                placeholder="Type ward name..."
                className="flex-1 px-4 py-3 border-2 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-lol-gold focus:border-lol-gold"
                disabled={gameComplete}
              />
              <button
                onClick={handleInputSubmit}
                disabled={!inputValue.trim() || gameComplete}
                className="px-6 py-3 bg-lol-gold text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Submit
              </button>
            </div>
            
            {/* Dropdown */}
            {showDropdown && filteredWards.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                {filteredWards.slice(0, 10).map((ward) => (
                  <button
                    key={ward.id}
                    onClick={() => handleGuess(ward.name)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                  >
                    {ward.icon && (
                      <img src={ward.icon} alt={ward.name} className="w-6 h-6 object-cover rounded" />
                    )}
                    <span>{ward.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Zoom Progress Indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Zoomed In</span>
            <span>Zoomed Out</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((300 - zoomLevel) / 200) * 100}%` }}
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
        </div>
      )}
    </div>
  );
};

export default WardMode;