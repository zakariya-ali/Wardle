import React, { useState, useEffect } from 'react';
import { Champion, Item, SummonerSpell } from '../../types';
import { Shuffle, RefreshCw } from 'lucide-react';

interface UltimateBraveryModeProps {
  champions: Champion[];
  items: Item[];
  spells: SummonerSpell[];
}

const UltimateBraveryMode: React.FC<UltimateBraveryModeProps> = ({
  champions,
  items,
  spells
}) => {
  const [loadout, setLoadout] = useState<{
    champion: Champion | null;
    items: Item[];
    spells: SummonerSpell[];
  }>({
    champion: null,
    items: [],
    spells: []
  });

  const generateRandomLoadout = () => {
    const randomChampion = champions[Math.floor(Math.random() * champions.length)];
    const randomItems = [...items]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const randomSpells = [...spells]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    setLoadout({
      champion: randomChampion,
      items: randomItems,
      spells: randomSpells
    });
  };

  useEffect(() => {
    generateRandomLoadout();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Ultimate Bravery</h3>
          <button
            onClick={generateRandomLoadout}
            className="flex items-center space-x-2 px-4 py-2 bg-lol-gold hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Randomize</span>
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Get a completely random champion loadout for your next game! Click randomize for a new combination.
        </p>
      </div>

      {loadout.champion && (
        <div className="bg-gradient-to-br from-lol-blue to-lol-purple rounded-xl shadow-lg p-6 text-white">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Champion */}
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-3 text-lol-gold">Your Champion</h4>
              <div className="bg-white/10 rounded-lg p-4">
                <img
                  src={loadout.champion.splashArt}
                  alt={loadout.champion.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h5 className="text-xl font-bold">{loadout.champion.name}</h5>
                <p className="text-sm opacity-80 mt-1">
                  {loadout.champion.positions.join(' / ')}
                </p>
              </div>
            </div>

            {/* Items & Spells */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-lol-gold">Your Build</h4>
              
              {/* Items */}
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <h5 className="font-medium mb-3">Items</h5>
                <div className="grid grid-cols-3 gap-2">
                  {loadout.items.map((item) => (
                    <div key={item.id} className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-xs font-bold">ITM</span>
                      </div>
                      <p className="text-xs">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summoner Spells */}
              <div className="bg-white/10 rounded-lg p-4">
                <h5 className="font-medium mb-3">Summoner Spells</h5>
                <div className="grid grid-cols-2 gap-2">
                  {loadout.spells.map((spell) => (
                    <div key={spell.id} className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-xs font-bold">SPL</span>
                      </div>
                      <p className="text-xs">{spell.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shuffle className="w-5 h-5 text-lol-gold" />
              <span className="font-medium">Challenge Accepted!</span>
            </div>
            <p className="text-sm opacity-90">
              Try this random combination in your next game. Good luck, summoner!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UltimateBraveryMode;