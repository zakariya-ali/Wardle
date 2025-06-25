import { Champion, GameState } from '../types';

export const GAME_MODES = [
  { id: 'classic', name: 'Classic', description: 'Guess the champion by attributes', icon: 'User' },
  { id: 'quote', name: 'Quote', description: 'Guess the champion by their quote', icon: 'MessageSquare' },
  { id: 'ability', name: 'Ability', description: 'Guess the champion by ability icon', icon: 'Zap' },
  { id: 'splash', name: 'Splash Art', description: 'Guess the champion by splash art', icon: 'Image' },
  { id: 'ward', name: 'Ward', description: 'Guess the ward skin', icon: 'Eye' },
  { id: 'icon', name: 'Icon', description: 'Guess the summoner icon', icon: 'Smile' },
  { id: 'spell', name: 'Spell', description: 'Guess the summoner spell', icon: 'Sparkles' },
  { id: 'bravery', name: 'Ultimate Bravery', description: 'Random champion loadout', icon: 'Shuffle' }
];

export const getDailyResetTime = (): Date => {
  const now = new Date();
  const utcMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return utcMidnight;
};

export const shouldResetDaily = (lastReset: string): boolean => {
  if (!lastReset) return true;
  
  const lastResetDate = new Date(lastReset);
  const todayReset = getDailyResetTime();
  
  return lastResetDate < todayReset;
};

export const generateDailyAnswers = (champions: Champion[]): Record<string, string> => {
  const today = getDailyResetTime().toDateString();
  const seed = hashCode(today);
  
  const shuffled = [...champions].sort(() => {
    seed.next();
    return seed.value - 0.5;
  });

  return {
    classic: shuffled[0].id,
    quote: shuffled[1].id,
    ability: shuffled[2].id,
    splash: shuffled[3].id,
    ward: 'ward_classic',
    icon: 'icon_1',
    spell: 'flash',
    bravery: shuffled[4].id
  };
};

function hashCode(str: string) {
  let hash = 0;
  let index = 0;
  
  const next = () => {
    hash = ((hash << 5) - hash + str.charCodeAt(index % str.length)) & 0xffffffff;
    index++;
    return (hash / 0xffffffff + 1) / 2;
  };
  
  return { next, get value() { return next(); } };
}

export const compareChampionAttributes = (guess: Champion, answer: Champion) => {
  return {
    gender: guess.gender === answer.gender ? 'correct' : 'incorrect',
    positions: guess.positions.some(p => answer.positions.includes(p)) 
      ? (guess.positions.length === answer.positions.length && 
         guess.positions.every(p => answer.positions.includes(p))) 
        ? 'correct' : 'partial' 
      : 'incorrect',
    species: guess.species.some(s => answer.species.includes(s)) 
      ? (guess.species.length === answer.species.length && 
         guess.species.every(s => answer.species.includes(s)))
        ? 'correct' : 'partial'
      : 'incorrect',
    resource: guess.resource === answer.resource ? 'correct' : 'incorrect',
    rangeType: guess.rangeType === answer.rangeType ? 'correct' : 'incorrect',
    regions: guess.regions.some(r => answer.regions.includes(r))
      ? (guess.regions.length === answer.regions.length && 
         guess.regions.every(r => answer.regions.includes(r)))
        ? 'correct' : 'partial'
      : 'incorrect',
    releaseYear: guess.releaseYear === answer.releaseYear ? 'correct' : 
                 Math.abs(guess.releaseYear - answer.releaseYear) <= 2 ? 'partial' : 'incorrect'
  };
};

export const loadGameState = (): GameState => {
  const saved = localStorage.getItem('loldle-game-state');
  if (saved) {
    return JSON.parse(saved);
  }
  
  return {
    currentMode: 'classic',
    dailyAnswers: {},
    guesses: {},
    gameComplete: {},
    lastReset: ''
  };
};

export const saveGameState = (state: GameState): void => {
  localStorage.setItem('loldle-game-state', JSON.stringify(state));
};