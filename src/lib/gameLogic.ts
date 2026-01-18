import { LetterResult, LetterState, GuessResult, GameState, GameStatus } from '@/types/game';
import { WORD_LENGTH, MAX_ATTEMPTS, isValidWord } from './words';

// Evaluate a guess against the target word
export const evaluateGuess = (guess: string, targetWord: string): LetterResult[] => {
  const guessUpper = guess.toUpperCase();
  const targetUpper = targetWord.toUpperCase();
  
  const results: LetterResult[] = Array(WORD_LENGTH).fill(null).map((_, i) => ({
    letter: guessUpper[i],
    state: 'absent' as LetterState
  }));
  
  const targetLetterCounts: Record<string, number> = {};
  
  // Count letters in target word
  for (const letter of targetUpper) {
    targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
  }
  
  // First pass: mark correct letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessUpper[i] === targetUpper[i]) {
      results[i].state = 'correct';
      targetLetterCounts[guessUpper[i]]--;
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (results[i].state !== 'correct') {
      const letter = guessUpper[i];
      if (targetLetterCounts[letter] > 0) {
        results[i].state = 'present';
        targetLetterCounts[letter]--;
      }
    }
  }
  
  return results;
};

// Check if the guess is correct
export const isCorrectGuess = (guess: string, targetWord: string): boolean => {
  return guess.toUpperCase() === targetWord.toUpperCase();
};

// Update keyboard state based on guess results
export const updateKeyboardState = (
  currentState: Record<string, LetterState>,
  guessResult: GuessResult
): Record<string, LetterState> => {
  const newState = { ...currentState };
  
  for (const { letter, state } of guessResult.results) {
    const currentLetterState = newState[letter];
    
    // Priority: correct > present > absent
    if (state === 'correct') {
      newState[letter] = 'correct';
    } else if (state === 'present' && currentLetterState !== 'correct') {
      newState[letter] = 'present';
    } else if (state === 'absent' && !currentLetterState) {
      newState[letter] = 'absent';
    }
  }
  
  return newState;
};

// Create initial game state
export const createInitialGameState = (targetWord: string): GameState => {
  return {
    targetWord: targetWord.toUpperCase(),
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    keyboardState: {}
  };
};

// Process a guess and return updated game state
export const processGuess = (state: GameState, guess: string): GameState => {
  if (state.gameStatus !== 'playing') {
    return state;
  }
  
  if (guess.length !== WORD_LENGTH) {
    return state;
  }
  
  if (!isValidWord(guess)) {
    return state;
  }
  
  const results = evaluateGuess(guess, state.targetWord);
  const guessResult: GuessResult = { guess: guess.toUpperCase(), results };
  
  const newGuesses = [...state.guesses, guessResult];
  const newAttempts = state.attempts + 1;
  const newKeyboardState = updateKeyboardState(state.keyboardState, guessResult);
  
  let newStatus: GameStatus = 'playing';
  
  if (isCorrectGuess(guess, state.targetWord)) {
    newStatus = 'won';
  } else if (newAttempts >= MAX_ATTEMPTS) {
    newStatus = 'lost';
  }
  
  return {
    ...state,
    guesses: newGuesses,
    currentGuess: '',
    gameStatus: newStatus,
    attempts: newAttempts,
    keyboardState: newKeyboardState
  };
};

// Add a letter to current guess
export const addLetter = (state: GameState, letter: string): GameState => {
  if (state.gameStatus !== 'playing') {
    return state;
  }
  
  if (state.currentGuess.length >= WORD_LENGTH) {
    return state;
  }
  
  return {
    ...state,
    currentGuess: state.currentGuess + letter.toUpperCase()
  };
};

// Remove last letter from current guess
export const removeLetter = (state: GameState): GameState => {
  if (state.gameStatus !== 'playing') {
    return state;
  }
  
  if (state.currentGuess.length === 0) {
    return state;
  }
  
  return {
    ...state,
    currentGuess: state.currentGuess.slice(0, -1)
  };
};

// Get empty rows for display
export const getEmptyRows = (guessCount: number): number => {
  return Math.max(0, MAX_ATTEMPTS - guessCount - 1);
};

// Format time for display
export const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
};

// Calculate win percentage
export const calculateWinPercentage = (won: number, played: number): number => {
  if (played === 0) return 0;
  return Math.round((won / played) * 100);
};
