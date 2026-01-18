'use client';

import { useGameStore } from '@/store/gameStore';
import { LetterState, GuessResult } from '@/types/game';
import { WORD_LENGTH, MAX_ATTEMPTS } from '@/lib/words';

const getLetterStyle = (state: LetterState): string => {
  switch (state) {
    case 'correct':
      return 'bg-green-500 border-green-500 text-white';
    case 'present':
      return 'bg-yellow-500 border-yellow-500 text-white';
    case 'absent':
      return 'bg-gray-600 border-gray-600 text-white';
    default:
      return 'bg-transparent border-gray-400 text-white';
  }
};

interface TileProps {
  letter: string;
  state: LetterState;
  delay?: number;
  isRevealing?: boolean;
}

const Tile = ({ letter, state, delay = 0, isRevealing = false }: TileProps) => {
  const baseStyle = 'w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase transition-all duration-300';
  const stateStyle = getLetterStyle(state);
  const animationStyle = isRevealing ? `animate-flip` : letter ? 'animate-pop' : '';
  
  return (
    <div 
      className={`${baseStyle} ${stateStyle} ${animationStyle}`}
      style={{ 
        animationDelay: isRevealing ? `${delay * 300}ms` : '0ms',
        transitionDelay: isRevealing ? `${delay * 300}ms` : '0ms'
      }}
    >
      {letter}
    </div>
  );
};

interface RowProps {
  guess?: GuessResult;
  currentGuess?: string;
  isCurrentRow?: boolean;
  isShaking?: boolean;
}

const Row = ({ guess, currentGuess = '', isCurrentRow = false, isShaking = false }: RowProps) => {
  const tiles = [];
  
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess) {
      // Completed guess row
      tiles.push(
        <Tile
          key={i}
          letter={guess.results[i].letter}
          state={guess.results[i].state}
          delay={i}
          isRevealing={true}
        />
      );
    } else if (isCurrentRow) {
      // Current input row
      tiles.push(
        <Tile
          key={i}
          letter={currentGuess[i] || ''}
          state="empty"
        />
      );
    } else {
      // Empty row
      tiles.push(
        <Tile
          key={i}
          letter=""
          state="empty"
        />
      );
    }
  }
  
  return (
    <div className={`flex gap-1.5 ${isShaking ? 'animate-shake' : ''}`}>
      {tiles}
    </div>
  );
};

export const GameGrid = () => {
  const { gameState, isShaking } = useGameStore();
  const { guesses, currentGuess } = gameState;
  
  const rows = [];
  
  // Add completed guess rows
  for (let i = 0; i < guesses.length; i++) {
    rows.push(
      <Row key={`guess-${i}`} guess={guesses[i]} />
    );
  }
  
  // Add current input row if game is still playing
  if (guesses.length < MAX_ATTEMPTS && gameState.gameStatus === 'playing') {
    rows.push(
      <Row 
        key="current" 
        currentGuess={currentGuess} 
        isCurrentRow={true}
        isShaking={isShaking}
      />
    );
  }
  
  // Add empty rows
  const emptyRowsCount = MAX_ATTEMPTS - guesses.length - (gameState.gameStatus === 'playing' ? 1 : 0);
  for (let i = 0; i < emptyRowsCount; i++) {
    rows.push(<Row key={`empty-${i}`} />);
  }
  
  return (
    <div className="flex flex-col gap-1.5 p-4">
      {rows}
    </div>
  );
};
