'use client';

import { useGameStore } from '@/store/gameStore';
import { LetterState } from '@/types/game';
import { useCallback, useEffect } from 'react';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

const getKeyStyle = (state?: LetterState): string => {
  switch (state) {
    case 'correct':
      return 'bg-green-500 hover:bg-green-600 text-white';
    case 'present':
      return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    case 'absent':
      return 'bg-gray-700 hover:bg-gray-600 text-gray-300';
    default:
      return 'bg-gray-500 hover:bg-gray-400 text-white';
  }
};

interface KeyProps {
  letter: string;
  state?: LetterState;
  onClick: (key: string) => void;
}

const Key = ({ letter, state, onClick }: KeyProps) => {
  const isWide = letter === 'ENTER' || letter === '⌫';
  const baseStyle = `
    ${isWide ? 'px-3 sm:px-4' : 'px-2 sm:px-3'} 
    py-4 sm:py-5 
    rounded-md 
    font-bold 
    text-sm sm:text-base
    transition-all 
    duration-150 
    active:scale-95
    select-none
  `;
  
  return (
    <button
      className={`${baseStyle} ${getKeyStyle(state)}`}
      onClick={() => onClick(letter)}
      aria-label={letter === '⌫' ? 'Backspace' : letter}
    >
      {letter}
    </button>
  );
};

export const Keyboard = () => {
  const { handleKeyPress, gameState } = useGameStore();
  const { keyboardState, gameStatus } = gameState;
  
  const onKeyClick = useCallback((key: string) => {
    if (gameStatus !== 'playing') return;
    handleKeyPress(key);
  }, [handleKeyPress, gameStatus]);
  
  // Handle physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, gameStatus]);
  
  return (
    <div className="flex flex-col gap-1.5 p-2 max-w-lg mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5">
          {row.map((key) => (
            <Key
              key={key}
              letter={key}
              state={keyboardState[key]}
              onClick={onKeyClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
