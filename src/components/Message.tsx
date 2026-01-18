'use client';

import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export const Message = () => {
  const { message, clearMessage, gameState } = useGameStore();
  
  useEffect(() => {
    if (message && gameState.gameStatus === 'playing') {
      const timer = setTimeout(clearMessage, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage, gameState.gameStatus]);
  
  if (!message) return null;
  
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-white text-black px-4 py-2 rounded-lg font-bold shadow-lg animate-fade-in">
        {message}
      </div>
    </div>
  );
};
