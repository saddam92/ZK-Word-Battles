import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameStats, ZKProof, Player, GuessResult } from '@/types/game';
import { getDailyWord } from '@/lib/words';
import { createInitialGameState, processGuess, addLetter, removeLetter } from '@/lib/gameLogic';
import { generateZKProof, verifyZKProof, calculateScore } from '@/lib/zkProof';
import { v4 as uuidv4 } from 'uuid';

interface GameStore {
  // Player info
  player: Player | null;
  playerId: string;
  playerName: string;
  
  // Game state
  gameState: GameState;
  startTime: number | null;
  endTime: number | null;
  
  // Stats
  stats: GameStats;
  
  // ZK Proofs
  currentProof: ZKProof | null;
  proofHistory: ZKProof[];
  
  // UI state
  isShaking: boolean;
  showStats: boolean;
  showProof: boolean;
  message: string | null;
  
  // Actions
  initGame: () => void;
  setPlayerName: (name: string) => void;
  handleKeyPress: (key: string) => void;
  submitGuess: () => void;
  generateProof: () => void;
  resetGame: () => void;
  setShowStats: (show: boolean) => void;
  setShowProof: (show: boolean) => void;
  clearMessage: () => void;
}

const getStoredPlayerId = (): string => {
  if (typeof window === 'undefined') return uuidv4();
  const stored = localStorage.getItem('zk-word-battles-player-id');
  if (stored) return stored;
  const newId = uuidv4();
  localStorage.setItem('zk-word-battles-player-id', newId);
  return newId;
};

const getTodayKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      player: null,
      playerId: '',
      playerName: '',
      gameState: createInitialGameState(getDailyWord()),
      startTime: null,
      endTime: null,
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: [0, 0, 0, 0, 0, 0]
      },
      currentProof: null,
      proofHistory: [],
      isShaking: false,
      showStats: false,
      showProof: false,
      message: null,

      initGame: () => {
        const playerId = getStoredPlayerId();
        const todayKey = getTodayKey();
        const state = get();
        
        // Check if we already played today
        const todayProof = state.proofHistory.find(p => p.gameDate === todayKey);
        
        if (todayProof) {
          // Already played today, show stats
          set({ 
            playerId,
            showStats: true,
            currentProof: todayProof
          });
        } else {
          // New game for today
          set({
            playerId,
            gameState: createInitialGameState(getDailyWord()),
            startTime: null,
            endTime: null,
            currentProof: null
          });
        }
      },

      setPlayerName: (name: string) => {
        set({ playerName: name });
      },

      handleKeyPress: (key: string) => {
        const state = get();
        
        if (state.gameState.gameStatus !== 'playing') {
          return;
        }

        // Start timer on first key press
        if (!state.startTime) {
          set({ startTime: Date.now() });
        }

        if (key === 'ENTER') {
          get().submitGuess();
        } else if (key === 'BACKSPACE' || key === '⌫') {
          set({ gameState: removeLetter(state.gameState) });
        } else if (/^[A-Z]$/i.test(key)) {
          set({ gameState: addLetter(state.gameState, key.toUpperCase()) });
        }
      },

      submitGuess: () => {
        const state = get();
        const { gameState } = state;

        if (gameState.currentGuess.length !== 5) {
          set({ 
            isShaking: true, 
            message: 'Not enough letters' 
          });
          setTimeout(() => set({ isShaking: false }), 500);
          return;
        }

        const newState = processGuess(gameState, gameState.currentGuess);
        
        if (newState === gameState) {
          // Invalid word
          set({ 
            isShaking: true, 
            message: 'Not in word list' 
          });
          setTimeout(() => set({ isShaking: false }), 500);
          return;
        }

        set({ gameState: newState, message: null });

        // Check if game ended
        if (newState.gameStatus !== 'playing') {
          const endTime = Date.now();
          set({ endTime });

          // Update stats
          const stats = { ...state.stats };
          stats.gamesPlayed++;
          
          if (newState.gameStatus === 'won') {
            stats.gamesWon++;
            stats.currentStreak++;
            stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
            stats.guessDistribution[newState.attempts - 1]++;
            
            set({ 
              stats,
              message: getWinMessage(newState.attempts)
            });
          } else {
            stats.currentStreak = 0;
            set({ 
              stats,
              message: `The word was ${newState.targetWord}`
            });
          }

          // Auto-generate proof
          setTimeout(() => get().generateProof(), 1000);
        }
      },

      generateProof: () => {
        const state = get();
        const { gameState, playerId, startTime, endTime } = state;

        if (gameState.gameStatus === 'playing') {
          return;
        }

        const proof = generateZKProof(
          playerId,
          gameState.targetWord,
          gameState.guesses,
          gameState.gameStatus === 'won'
        );

        // Verify the proof
        proof.verified = verifyZKProof(proof);

        // Calculate score
        const timeMs = endTime && startTime ? endTime - startTime : 0;
        const score = calculateScore(
          gameState.gameStatus === 'won',
          gameState.attempts,
          timeMs
        );

        // Update player
        const player: Player = {
          id: playerId,
          name: state.playerName || 'Anonymous',
          score,
          gamesPlayed: state.stats.gamesPlayed,
          gamesWon: state.stats.gamesWon,
          currentStreak: state.stats.currentStreak,
          maxStreak: state.stats.maxStreak,
          averageAttempts: calculateAverageAttempts(state.stats),
          zkProofs: [...state.proofHistory, proof]
        };

        set({
          currentProof: proof,
          proofHistory: [...state.proofHistory, proof],
          player,
          showProof: true
        });

        // Submit to leaderboard
        submitToLeaderboard(player, proof);
      },

      resetGame: () => {
        set({
          gameState: createInitialGameState(getDailyWord()),
          startTime: null,
          endTime: null,
          currentProof: null,
          message: null
        });
      },

      setShowStats: (show: boolean) => set({ showStats: show }),
      setShowProof: (show: boolean) => set({ showProof: show }),
      clearMessage: () => set({ message: null })
    }),
    {
      name: 'zk-word-battles-storage',
      partialize: (state) => ({
        playerName: state.playerName,
        stats: state.stats,
        proofHistory: state.proofHistory
      })
    }
  )
);

// Helper functions
const getWinMessage = (attempts: number): string => {
  const messages = [
    'Genius! 🧠',
    'Magnificent! ✨',
    'Impressive! 🌟',
    'Splendid! 👏',
    'Great! 👍',
    'Phew! 😅'
  ];
  return messages[attempts - 1] || 'Nice!';
};

const calculateAverageAttempts = (stats: GameStats): number => {
  if (stats.gamesWon === 0) return 0;
  
  let total = 0;
  for (let i = 0; i < stats.guessDistribution.length; i++) {
    total += stats.guessDistribution[i] * (i + 1);
  }
  return Math.round((total / stats.gamesWon) * 10) / 10;
};

const submitToLeaderboard = async (player: Player, proof: ZKProof) => {
  try {
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player, proof })
    });
  } catch (error) {
    console.error('Failed to submit to leaderboard:', error);
  }
};
