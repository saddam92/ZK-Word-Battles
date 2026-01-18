'use client';

import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';

export const Header = () => {
  const { setShowStats, playerName, setPlayerName } = useGameStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  const handleSaveName = () => {
    setPlayerName(tempName);
    setShowSettings(false);
  };

  return (
    <>
      <header className="w-full border-b border-gray-700 py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button 
            onClick={() => setShowHelp(true)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Help"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ZK</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider">
              ZK Word Battles
            </h1>
          </div>
          
          <div className="flex gap-1">
            <button 
              onClick={() => setShowStats(true)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Statistics"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
            <button 
              onClick={() => {
                setTempName(playerName);
                setShowSettings(true);
              }}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">How To Play</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <p>Guess the <strong className="text-white">WORDLE</strong> in 6 tries.</p>
              
              <p>Each guess must be a valid 5-letter word. Hit the enter button to submit.</p>
              
              <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
              
              <div className="border-t border-gray-700 pt-4">
                <p className="font-bold text-white mb-2">Examples</p>
                
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 bg-green-500 flex items-center justify-center font-bold">W</div>
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">E</div>
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">A</div>
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">R</div>
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">Y</div>
                </div>
                <p className="text-sm mb-4"><strong className="text-green-500">W</strong> is in the word and in the correct spot.</p>
                
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">P</div>
                  <div className="w-10 h-10 bg-yellow-500 flex items-center justify-center font-bold">I</div>
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">L</div>
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">L</div>
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">S</div>
                </div>
                <p className="text-sm mb-4"><strong className="text-yellow-500">I</strong> is in the word but in the wrong spot.</p>
                
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">V</div>
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">A</div>
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">G</div>
                  <div className="w-10 h-10 bg-gray-600 flex items-center justify-center font-bold">U</div>
                  <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center font-bold">E</div>
                </div>
                <p className="text-sm"><strong className="text-gray-400">U</strong> is not in the word in any spot.</p>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <p className="font-bold text-white mb-2">🔐 Zero-Knowledge Proofs</p>
                <p className="text-sm">
                  When you complete a game, a ZK proof is generated that proves you solved the puzzle 
                  <strong className="text-purple-400"> without revealing the answer</strong>. 
                  This proof is verified by the Soundness Layer, ensuring fair and cheat-proof leaderboards!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Player Name
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={20}
                />
              </div>
              
              <button
                onClick={handleSaveName}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
