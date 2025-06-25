import React, { useState, useEffect } from 'react';
import { Champion } from './types';
import { useGameData } from './hooks/useGameData';
import {
  loadGameState,
  saveGameState,
  shouldResetDaily,
  generateDailyAnswers,
  GAME_MODES
} from './utils/gameLogic';

import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import ClassicMode from './components/modes/ClassicMode';
import QuoteMode from './components/modes/QuoteMode';
import UltimateBraveryMode from './components/modes/UltimateBraveryMode';

function App() {
  const { champions, items, spells, wards, icons, loading } = useGameData();
  const [gameState, setGameState] = useState(loadGameState());

  // Initialize daily answers and reset if needed
  useEffect(() => {
    if (champions.length > 0 && (shouldResetDaily(gameState.lastReset) || Object.keys(gameState.dailyAnswers).length === 0)) {
      const newAnswers = generateDailyAnswers(champions);
      const newGameState = {
        ...gameState,
        dailyAnswers: newAnswers,
        guesses: {},
        gameComplete: {},
        lastReset: new Date().toISOString()
      };
      setGameState(newGameState);
      saveGameState(newGameState);
    }
  }, [champions]);

  const handleModeChange = (mode: string) => {
    const newGameState = { ...gameState, currentMode: mode };
    setGameState(newGameState);
    saveGameState(newGameState);
  };

  const handleGuess = (guess: any) => {
    const currentMode = gameState.currentMode;
    const currentGuesses = gameState.guesses[currentMode] || [];
    const newGuesses = [...currentGuesses, guess];
    
    // Check if guess is correct
    let isCorrect = false;
    const answer = getCurrentAnswer();
    
    if (currentMode === 'classic') {
      isCorrect = guess.id === answer?.id;
    } else if (currentMode === 'quote') {
      isCorrect = guess.toLowerCase() === answer?.name.toLowerCase();
    }

    const newGameState = {
      ...gameState,
      guesses: {
        ...gameState.guesses,
        [currentMode]: newGuesses
      },
      gameComplete: {
        ...gameState.gameComplete,
        [currentMode]: isCorrect
      }
    };

    setGameState(newGameState);
    saveGameState(newGameState);
  };

  const getCurrentAnswer = (): Champion | null => {
    const answerId = gameState.dailyAnswers[gameState.currentMode];
    return champions.find(c => c.id === answerId) || null;
  };

  const handleReset = () => {
    const newAnswers = generateDailyAnswers(champions);
    const newGameState = {
      currentMode: 'classic',
      dailyAnswers: newAnswers,
      guesses: {},
      gameComplete: {},
      lastReset: new Date().toISOString()
    };
    setGameState(newGameState);
    saveGameState(newGameState);
  };

  const renderCurrentMode = () => {
    const currentAnswer = getCurrentAnswer();
    const currentGuesses = gameState.guesses[gameState.currentMode] || [];
    const isComplete = gameState.gameComplete[gameState.currentMode] || false;

    switch (gameState.currentMode) {
      case 'classic':
        return currentAnswer ? (
          <ClassicMode
            champions={champions}
            answer={currentAnswer}
            guesses={currentGuesses}
            onGuess={handleGuess}
            gameComplete={isComplete}
          />
        ) : null;

      case 'quote':
        return currentAnswer ? (
          <QuoteMode
            champions={champions}
            answer={currentAnswer}
            guesses={currentGuesses}
            onGuess={handleGuess}
            gameComplete={isComplete}
          />
        ) : null;

      case 'bravery':
        return (
          <UltimateBraveryMode
            champions={champions}
            items={items}
            spells={spells}
          />
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Coming Soon!
            </h3>
            <p className="text-gray-600">
              This game mode is under development. Stay tuned!
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lol-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading LoLdle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header onReset={handleReset} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <ModeSelector
          currentMode={gameState.currentMode}
          onModeChange={handleModeChange}
          completedModes={gameState.gameComplete}
        />
        
        <div className="animate-fade-in">
          {renderCurrentMode()}
        </div>
      </main>

      <footer className="bg-lol-dark text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm opacity-80">
            LoLdle - League of Legends Guessing Game | Daily puzzles reset at midnight UTC
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;