import React, { useState, useEffect } from 'react';
import { SummonerIcon } from '../../types';

interface SummonerIconModeProps {
  icons: SummonerIcon[];
  answer: SummonerIcon;
  guesses: string[];
  onGuess: (guess: string) => void;
  gameComplete: boolean;
}

const SummonerIconMode: React.FC<SummonerIconModeProps> = ({
  icons,
  answer,
  guesses,
  onGuess,
  gameComplete
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredIcons, setFilteredIcons] = useState<SummonerIcon[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = icons.filter(icon =>
        icon.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredIcons(filtered);
      setShowDropdown(true);
    } else {
      setFilteredIcons([]);
      setShowDropdown(false);
    }
  }, [inputValue, icons]);

  const handleGuess = (iconName: string) => {
    if (!gameComplete && !guesses.includes(iconName)) {
      onGuess(iconName);
      setInputValue('');
      setShowDropdown(false);
    }
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      const exactMatch = icons.find(icon => 
        icon.name.toLowerCase() === inputValue.toLowerCase()
      );
      if (exactMatch) {
        handleGuess(exactMatch.name);
      }
    }
  };

  const isCorrectGuess = (guess: string) => {
    return guess.toLowerCase() === answer.name.toLowerCase();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Summoner Icon Mode</h3>
          <p className="text-gray-600">Guess the summoner icon by its image!</p>
        </div>

        {/* Icon Display */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32 bg-gray-200 rounded-lg overflow-hidden border-4 border-gray-300">
            {answer.icon ? (
              <img 
                src={answer.icon}
                alt="Summoner Icon"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-600">
                <div className="text-white text-4xl font-bold opacity-50">
                  🎭
                </div>
              </div>
            )}
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
                placeholder="Type summoner icon name..."
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
            {showDropdown && filteredIcons.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                {filteredIcons.slice(0, 10).map((icon) => (
                  <button
                    key={icon.id}
                    onClick={() => handleGuess(icon.name)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                  >
                    {icon.icon && (
                      <img src={icon.icon} alt={icon.name} className="w-6 h-6 object-cover rounded" />
                    )}
                    <span>{icon.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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

      {/* Hint */}
      {!gameComplete && guesses.length >= 3 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            <strong>Hint:</strong> This icon is from the {answer.name.includes('Season') ? 'seasonal' : 'general'} collection.
          </p>
        </div>
      )}
    </div>
  );
};

export default SummonerIconMode;