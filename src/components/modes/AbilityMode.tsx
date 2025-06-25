import React, { useState, useEffect } from 'react';
import { Champion } from '../../types';
import SearchInput from '../SearchInput';

interface AbilityModeProps {
  champions: Champion[];
  answer: Champion;
  guesses: string[];
  onGuess: (guess: string) => void;
  gameComplete: boolean;
}

const AbilityMode: React.FC<AbilityModeProps> = ({
  champions,
  answer,
  guesses,
  onGuess,
  gameComplete
}) => {
  const [selectedAbility, setSelectedAbility] = useState<'Q' | 'W' | 'E' | 'R'>('Q');

  useEffect(() => {
    // Randomly select which ability to show for the daily puzzle
    const abilities: ('Q' | 'W' | 'E' | 'R')[] = ['Q', 'W', 'E', 'R'];
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    setSelectedAbility(abilities[seed % 4]);
  }, [answer]);

  const handleGuess = (championName: string) => {
    if (!gameComplete && !guesses.includes(championName)) {
      onGuess(championName);
    }
  };

  const isCorrectGuess = (guess: string) => {
    return guess.toLowerCase() === answer.name.toLowerCase();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ability Mode</h3>
          <p className="text-gray-600">Guess the champion by their ability icon!</p>
        </div>

        {/* Ability Icon Display */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
              {answer.abilities[selectedAbility]?.icon ? (
                <img 
                  src={answer.abilities[selectedAbility].icon} 
                  alt="Ability Icon"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-4xl font-bold text-gray-500">
                  {selectedAbility}
                </div>
              )}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm font-semibold text-gray-600">
                {selectedAbility} Ability
              </span>
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
            Ability: {answer.abilities[selectedAbility]?.name || `${selectedAbility} Ability`}
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
            Ability: {answer.abilities[selectedAbility]?.name || `${selectedAbility} Ability`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AbilityMode;