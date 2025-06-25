import React from 'react';
import { Crown, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-gradient-to-r from-lol-blue to-lol-purple text-white py-6 px-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Crown className="w-8 h-8 text-lol-gold" />
          <div>
            <h1 className="text-3xl font-bold">LoLdle</h1>
            <p className="text-sm opacity-80">League of Legends Guessing Game</p>
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 bg-lol-gold hover:bg-yellow-500 text-lol-blue rounded-lg font-medium transition-colors duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Daily</span>
        </button>
      </div>
    </header>
  );
};

export default Header;