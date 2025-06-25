import React, { useState, useEffect } from 'react';
import { Champion } from '../../types';
import SearchInput from '../SearchInput';
import { MessageSquare } from 'lucide-react';

interface QuoteModeProps {
  champions: Champion[];
  answer: Champion;
  guesses: string[];
  onGuess: (guess: string) => void;
  gameComplete: boolean;
}

const QuoteMode: React.FC<QuoteModeProps> = ({
  champions,
  answer,
  guesses,
  onGuess,
  gameComplete
}) => {
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    if (answer.quotes && answer.quotes.length > 0) {
      const randomQuote = answer.quotes[Math.floor(Math.random() * answer.quotes.length)];
      setCurrentQuote(randomQuote);
    }
  }, [answer]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quote Mode</h3>
        <p className="text-gray-600 mb-6">
          Listen to the quote and guess which champion said it!
        </p>
        
        <div className="bg-gradient-to-r from-lol-blue to-lol-purple rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <MessageSquare className="w-6 h-6 text-lol-gold flex-shrink-0 mt-1" />
            <blockquote className="text-white text-lg italic font-medium">
              "{currentQuote}"
            </blockquote>
          </div>
        </div>
        
        <SearchInput
          suggestions={champions.map(c => c.name)}
          onSubmit={onGuess}
          placeholder="Which champion said this?"
          disabled={gameComplete}
        />
      </div>

      {guesses.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-3">Your Guesses:</h4>
          <div className="space-y-2">
            {guesses.map((guess, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  guess.toLowerCase() === answer.name.toLowerCase()
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {guess}
              </div>
            ))}
          </div>
        </div>
      )}

      {gameComplete && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <h4 className="text-xl font-semibold text-green-800 mb-2">
            Correct! 🎉
          </h4>
          <p className="text-green-700 mb-4">
            The answer was <strong>{answer.name}</strong>!
          </p>
          <img
            src={answer.splashArt}
            alt={answer.name}
            className="w-48 h-32 object-cover rounded-lg mx-auto"
          />
        </div>
      )}
    </div>
  );
};

export default QuoteMode;