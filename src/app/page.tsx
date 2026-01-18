'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { GameGrid } from '@/components/GameGrid';
import { Keyboard } from '@/components/Keyboard';
import { StatsModal } from '@/components/StatsModal';
import { ProofModal } from '@/components/ProofModal';
import { Message } from '@/components/Message';
import { Leaderboard } from '@/components/Leaderboard';
import { BattleMode } from '@/components/BattleMode';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const { initGame, gameState } = useGameStore();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBattle, setShowBattle] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initGame();
  }, [initGame]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-4">
        {/* Game Status Banner */}
        {gameState.gameStatus !== 'playing' && (
          <div className={`mb-4 px-6 py-3 rounded-lg font-bold text-lg ${
            gameState.gameStatus === 'won' 
              ? 'bg-green-600/20 border border-green-600 text-green-400' 
              : 'bg-red-600/20 border border-red-600 text-red-400'
          }`}>
            {gameState.gameStatus === 'won' 
              ? `🎉 You won in ${gameState.attempts} ${gameState.attempts === 1 ? 'try' : 'tries'}!` 
              : `The word was ${gameState.targetWord}`}
          </div>
        )}
        
        <GameGrid />
        
        <div className="mt-4">
          <Keyboard />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>🏆</span>
            Leaderboard
          </button>
          <button
            onClick={() => setShowBattle(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>⚔️</span>
            Battle Mode
          </button>
        </div>
        
        {/* ZK Info Banner */}
        <div className="mt-8 max-w-md mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                <span className="text-white font-bold text-sm">ZK</span>
              </div>
              <div>
                <h3 className="font-bold text-sm">Zero-Knowledge Verified</h3>
                <p className="text-xs text-gray-400">
                  Your gameplay is cryptographically proven without revealing the answer
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-800">
        <p>
          Powered by <span className="text-purple-400">Soundness Layer</span> • 
          ZK proofs for fair, cheat-proof gaming
        </p>
      </footer>
      
      {/* Modals */}
      <Message />
      <StatsModal />
      <ProofModal />
      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <BattleMode isOpen={showBattle} onClose={() => setShowBattle(false)} />
    </div>
  );
}
