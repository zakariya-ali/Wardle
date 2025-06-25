import React from 'react';
import * as Icons from 'lucide-react';
import { GAME_MODES } from '../utils/gameLogic';

interface ModeSelectorProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
  completedModes: Record<string, boolean>;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ 
  currentMode, 
  onModeChange, 
  completedModes 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Game Modes</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GAME_MODES.map((mode) => {
          const IconComponent = Icons[mode.icon as keyof typeof Icons] as React.ComponentType<any>;
          const isActive = currentMode === mode.id;
          const isCompleted = completedModes[mode.id];
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`
                relative p-4 rounded-lg text-left transition-all duration-200 border-2
                ${isActive 
                  ? 'bg-lol-gold text-white border-lol-gold shadow-lg' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-lol-gold'
                }
                ${isCompleted && !isActive ? 'bg-green-50 border-green-200' : ''}
              `}
            >
              {isCompleted && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Icons.Check className="w-3 h-3 text-white" />
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{mode.name}</div>
                  <div className={`text-xs ${isActive ? 'text-yellow-100' : 'text-gray-500'}`}>
                    {mode.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;