export interface Champion {
  id: string;
  name: string;
  gender: string;
  positions: string[];
  species: string[];
  resource: string;
  rangeType: string;
  regions: string[];
  releaseYear: number;
  quotes: string[];
  abilities: {
    Q: { name: string; icon: string };
    W: { name: string; icon: string };
    E: { name: string; icon: string };
    R: { name: string; icon: string };
  };
  splashArt: string;
}

export interface SummonerSpell {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
}

export interface Ward {
  id: string;
  name: string;
  icon: string;
}

export interface SummonerIcon {
  id: string;
  name: string;
  icon: string;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GameState {
  currentMode: string;
  dailyAnswers: Record<string, string>;
  guesses: Record<string, any[]>;
  gameComplete: Record<string, boolean>;
  lastReset: string;
}

export interface GuessResult {
  correct: boolean;
  attribute?: string;
  status: 'correct' | 'incorrect' | 'partial';
}