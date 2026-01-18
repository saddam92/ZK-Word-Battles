export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface LetterResult {
  letter: string;
  state: LetterState;
}

export interface GuessResult {
  guess: string;
  results: LetterResult[];
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  targetWord: string;
  guesses: GuessResult[];
  currentGuess: string;
  gameStatus: GameStatus;
  attempts: number;
  maxAttempts: number;
  keyboardState: Record<string, LetterState>;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  averageAttempts: number;
  zkProofs: ZKProof[];
}

export interface ZKProof {
  id: string;
  playerId: string;
  timestamp: number;
  commitment: string;
  proof: string;
  publicInputs: string[];
  verified: boolean;
  gameDate: string;
  attempts: number;
  won: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  todayScore: number;
  totalScore: number;
  proofVerified: boolean;
}

export interface BattleRoom {
  id: string;
  players: BattlePlayer[];
  status: 'waiting' | 'playing' | 'finished';
  targetWord: string;
  startTime: number;
  endTime?: number;
  winner?: string;
}

export interface BattlePlayer {
  id: string;
  name: string;
  guesses: GuessResult[];
  currentGuess: string;
  gameStatus: GameStatus;
  attempts: number;
  finishTime?: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}
