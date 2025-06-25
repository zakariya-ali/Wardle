import React from 'react';
import { Champion } from '../../types';
import { compareChampionAttributes } from '../../utils/gameLogic';
import SearchInput from '../SearchInput';

interface ClassicModeProps {
  champions: Champion[];
  answer: Champion;
  guesses: Champion[];
  onGuess: (champion: Champion) => void;
  gameComplete: boolean;
}

const ClassicMode: React.FC<ClassicModeProps> = ({
  champions,
  answer,
  guesses,
  onGuess,
  gameComplete
}) => {
  const handleGuess = (championName: string) => {
    const champion = champions.find(c => c.name.toLowerCase() === championName.toLowerCase());
    if (champion) {
      onGuess(champion);
    }
  };

  const renderGuessRow = (guess: Champion, isAnswer: boolean = false) => {
    const comparison = compareChampionAttributes(guess, answer);
    
    const getCellClass = (status: string) => {
      switch (status) {
        case 'correct': return 'bg-green-500 text-white';
        case 'partial': return 'bg-yellow-500 text-white';
        default: return 'bg-red-500 text-white';
      }
    };

    return (
      <div key={guess.id} className={`grid grid-cols-8 gap-2 p-3 rounded-lg ${isAnswer ? 'bg-green-100 border-2 border-green-500' : 'bg-white'} animate-slide-up`}>
        <div className="font-medium text-center py-2 px-3 bg-gray-100 rounded">
          {guess.name}
        </div>
        <div className={`text-center py-2 px-3 rounded ${getCellClass(comparison.gender)}`}>
          {guess.gender}
        </div>
        <div className={`text-center py-2 px-3 rounded ${getCellClass(comparison.positions)}`}>
          {guess.positions.join(', ')}
        </div>
        <div className={`text-center py-2 px-3 rounded ${getCellClass(comparison.species)}`}>
          {guess.species.join(', ')}
        </div>
        <div className={`text-center py-2 px-3 rounded ${getCellClass(comparison.resource)}`}>
          {guess.resource}
        </div>
        <div className={`text-center py-2 px-3 rounded ${getCellClass(comparison.rangeType)}`}>
          {guess.rangeType}
        </div>
        <div className={`text-center py-2 px-3 rounded ${getCellClass(comparison.regions)}`}>
          {guess.regions.join(', ')}
        </div>
        <div className={`text-center py-2 px-3 rounded ${getCellClass(comparison.releaseYear)}`}>
          {guess.releaseYear}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Classic Mode</h3>
        <p className="text-gray-600 mb-6">
          Guess the champion by analyzing their attributes. Green means correct, yellow means partially correct, red means incorrect.
        </p>
        
        <SearchInput
          suggestions={champions.map(c => c.name)}
          onSubmit={handleGuess}
          placeholder="Enter champion name..."
          disabled={gameComplete}
        />
      </div>

      {guesses.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-8 gap-2 mb-4 text-sm font-medium text-gray-700">
            <div className="text-center">Champion</div>
            <div className="text-center">Gender</div>
            <div className="text-center">Position</div>
            <div className="text-center">Species</div>
            <div className="text-center">Resource</div>
            <div className="text-center">Range</div>
            <div className="text-center">Region</div>
            <div className="text-center">Release</div>
          </div>
          
          <div className="space-y-2">
            {guesses.map((guess) => renderGuessRow(guess))}
            {gameComplete && renderGuessRow(answer, true)}
          </div>
        </div>
      )}

      {gameComplete && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <h4 className="text-xl font-semibold text-green-800 mb-2">
            Congratulations! 🎉
          </h4>
          <p className="text-green-700">
            You guessed {answer.name} in {guesses.length} tries!
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassicMode;