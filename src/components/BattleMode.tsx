'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BattleRoom, BattlePlayer, GuessResult, LetterState } from '@/types/game';
import { evaluateGuess, isCorrectGuess } from '@/lib/gameLogic';
import { WORD_LENGTH, MAX_ATTEMPTS, isValidWord, getDailyWord } from '@/lib/words';
import { useGameStore } from '@/store/gameStore';

interface BattleModeProps {
  isOpen: boolean;
  onClose: () => void;
}

type BattleStatus = 'idle' | 'waiting' | 'playing' | 'finished';

export const BattleMode = ({ isOpen, onClose }: BattleModeProps) => {
  const { playerName, playerId } = useGameStore();
  const [status, setStatus] = useState<BattleStatus>('idle');
  const [room, setRoom] = useState<BattleRoom | null>(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [myGuesses, setMyGuesses] = useState<GuessResult[]>([]);
  const [opponentGuesses, setOpponentGuesses] = useState<GuessResult[]>([]);
  const [myStatus, setMyStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [opponentStatus, setOpponentStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [keyboardState, setKeyboardState] = useState<Record<string, LetterState>>({});
  const [countdown, setCountdown] = useState<number | null>(null);
  const [targetWord, setTargetWord] = useState('');
  
  // Simulated opponent for demo
  const simulateOpponent = useCallback(() => {
    if (!targetWord || opponentStatus !== 'playing') return;
    
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    
    setTimeout(() => {
      if (opponentStatus !== 'playing') return;
      
      // Simulate opponent making a guess
      const possibleGuesses = ['CRANE', 'SLATE', 'TRACE', 'CRATE', 'STARE', 'RAISE', 'ARISE', 'IRATE'];
      const randomGuess = possibleGuesses[Math.floor(Math.random() * possibleGuesses.length)];
      
      const results = evaluateGuess(randomGuess, targetWord);
      const guessResult: GuessResult = { guess: randomGuess, results };
      
      setOpponentGuesses(prev => [...prev, guessResult]);
      
      if (isCorrectGuess(randomGuess, targetWord)) {
        setOpponentStatus('won');
        if (myStatus === 'playing') {
          setMyStatus('lost');
          setMessage('Opponent won! 😢');
        }
      } else if (opponentGuesses.length + 1 >= MAX_ATTEMPTS) {
        setOpponentStatus('lost');
      }
    }, delay);
  }, [targetWord, opponentStatus, myStatus, opponentGuesses.length]);
  
  useEffect(() => {
    if (status === 'playing' && opponentStatus === 'playing') {
      simulateOpponent();
    }
  }, [status, opponentStatus, myGuesses.length, simulateOpponent]);
  
  const startBattle = () => {
    setStatus('waiting');
    setCountdown(3);
    
    // Countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start game after countdown
    setTimeout(() => {
      const word = getDailyWord();
      setTargetWord(word);
      setStatus('playing');
      setMyGuesses([]);
      setOpponentGuesses([]);
      setMyStatus('playing');
      setOpponentStatus('playing');
      setCurrentGuess('');
      setKeyboardState({});
      setRoom({
        id: uuidv4(),
        players: [
          { id: playerId, name: playerName || 'You', guesses: [], currentGuess: '', gameStatus: 'playing', attempts: 0 },
          { id: 'opponent', name: 'Opponent', guesses: [], currentGuess: '', gameStatus: 'playing', attempts: 0 }
        ],
        status: 'playing',
        targetWord: word,
        startTime: Date.now()
      });
    }, 3000);
  };
  
  const handleKeyPress = useCallback((key: string) => {
    if (status !== 'playing' || myStatus !== 'playing') return;
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE' || key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/i.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key.toUpperCase());
    }
  }, [status, myStatus, currentGuess]);
  
  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      setMessage('Not enough letters');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    
    if (!isValidWord(currentGuess)) {
      setMessage('Not in word list');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    
    const results = evaluateGuess(currentGuess, targetWord);
    const guessResult: GuessResult = { guess: currentGuess, results };
    
    setMyGuesses(prev => [...prev, guessResult]);
    setCurrentGuess('');
    setMessage(null);
    
    // Update keyboard state
    const newKeyboardState = { ...keyboardState };
    for (const { letter, state } of results) {
      if (state === 'correct') {
        newKeyboardState[letter] = 'correct';
      } else if (state === 'present' && newKeyboardState[letter] !== 'correct') {
        newKeyboardState[letter] = 'present';
      } else if (state === 'absent' && !newKeyboardState[letter]) {
        newKeyboardState[letter] = 'absent';
      }
    }
    setKeyboardState(newKeyboardState);
    
    if (isCorrectGuess(currentGuess, targetWord)) {
      setMyStatus('won');
      setMessage('You won! 🎉');
      if (opponentStatus === 'playing') {
        setOpponentStatus('lost');
      }
    } else if (myGuesses.length + 1 >= MAX_ATTEMPTS) {
      setMyStatus('lost');
      setMessage(`The word was ${targetWord}`);
    }
  };
  
  // Handle physical keyboard
  useEffect(() => {
    if (!isOpen || status !== 'playing') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [isOpen, status, handleKeyPress]);
  
  const resetBattle = () => {
    setStatus('idle');
    setRoom(null);
    setCurrentGuess('');
    setMyGuesses([]);
    setOpponentGuesses([]);
    setMyStatus('playing');
    setOpponentStatus('playing');
    setMessage(null);
    setKeyboardState({});
    setTargetWord('');
  };
  
  if (!isOpen) return null;
  
  const getLetterStyle = (state: LetterState): string => {
    switch (state) {
      case 'correct': return 'bg-green-500 border-green-500';
      case 'present': return 'bg-yellow-500 border-yellow-500';
      case 'absent': return 'bg-gray-600 border-gray-600';
      default: return 'bg-transparent border-gray-500';
    }
  };
  
  const renderMiniGrid = (guesses: GuessResult[], isMe: boolean) => {
    const rows = [];
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const guess = guesses[i];
      const tiles = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        if (guess) {
          tiles.push(
            <div 
              key={j} 
              className={`w-6 h-6 ${getLetterStyle(guess.results[j].state)} text-xs flex items-center justify-center font-bold`}
            >
              {guess.results[j].letter}
            </div>
          );
        } else if (isMe && i === guesses.length && j < currentGuess.length) {
          tiles.push(
            <div key={j} className="w-6 h-6 border border-gray-500 text-xs flex items-center justify-center font-bold">
              {currentGuess[j]}
            </div>
          );
        } else {
          tiles.push(
            <div key={j} className="w-6 h-6 border border-gray-700"></div>
          );
        }
      }
      rows.push(
        <div key={i} className="flex gap-0.5">
          {tiles}
        </div>
      );
    }
    return <div className="flex flex-col gap-0.5">{rows}</div>;
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full p-6 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            Battle Mode
          </h2>
          <button 
            onClick={() => { resetBattle(); onClose(); }}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Idle State */}
        {status === 'idle' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⚔️</div>
            <h3 className="text-2xl font-bold mb-2">Head-to-Head Battle</h3>
            <p className="text-gray-400 mb-6">
              Race against an opponent to solve the word first!
            </p>
            <button
              onClick={startBattle}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
            >
              Find Opponent
            </button>
          </div>
        )}
        
        {/* Waiting/Countdown State */}
        {status === 'waiting' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-pulse">🔍</div>
            <h3 className="text-2xl font-bold mb-2">
              {countdown !== null ? `Starting in ${countdown}...` : 'Finding opponent...'}
            </h3>
            {countdown !== null && (
              <div className="text-8xl font-bold text-purple-500 animate-bounce">
                {countdown}
              </div>
            )}
          </div>
        )}
        
        {/* Playing State */}
        {status === 'playing' && (
          <div>
            {/* Message */}
            {message && (
              <div className="text-center mb-4">
                <span className="bg-white text-black px-4 py-2 rounded-lg font-bold">
                  {message}
                </span>
              </div>
            )}
            
            {/* Battle Arena */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* My Side */}
              <div className={`p-4 rounded-lg ${myStatus === 'won' ? 'bg-green-900/30 border border-green-600' : myStatus === 'lost' ? 'bg-red-900/30 border border-red-600' : 'bg-gray-700/50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold">{playerName || 'You'}</span>
                  <span className="text-sm text-gray-400">{myGuesses.length}/{MAX_ATTEMPTS}</span>
                </div>
                {renderMiniGrid(myGuesses, true)}
                {myStatus !== 'playing' && (
                  <div className="mt-2 text-center font-bold">
                    {myStatus === 'won' ? '🏆 Winner!' : '❌ Lost'}
                  </div>
                )}
              </div>
              
              {/* Opponent Side */}
              <div className={`p-4 rounded-lg ${opponentStatus === 'won' ? 'bg-green-900/30 border border-green-600' : opponentStatus === 'lost' ? 'bg-red-900/30 border border-red-600' : 'bg-gray-700/50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold">Opponent</span>
                  <span className="text-sm text-gray-400">{opponentGuesses.length}/{MAX_ATTEMPTS}</span>
                </div>
                {renderMiniGrid(opponentGuesses, false)}
                {opponentStatus !== 'playing' && (
                  <div className="mt-2 text-center font-bold">
                    {opponentStatus === 'won' ? '🏆 Winner!' : '❌ Lost'}
                  </div>
                )}
              </div>
            </div>
            
            {/* Main Input Grid */}
            {myStatus === 'playing' && (
              <div className="flex flex-col items-center gap-1.5 mb-4">
                <div className={`flex gap-1.5 ${isShaking ? 'animate-shake' : ''}`}>
                  {Array(WORD_LENGTH).fill(null).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-12 h-12 border-2 flex items-center justify-center text-xl font-bold ${
                        currentGuess[i] ? 'border-gray-400' : 'border-gray-600'
                      }`}
                    >
                      {currentGuess[i] || ''}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Keyboard */}
            {myStatus === 'playing' && (
              <div className="flex flex-col gap-1.5 max-w-md mx-auto">
                {[
                  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
                ].map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-1">
                    {row.map((key) => {
                      const state = keyboardState[key];
                      const isWide = key === 'ENTER' || key === '⌫';
                      return (
                        <button
                          key={key}
                          onClick={() => handleKeyPress(key)}
                          className={`${isWide ? 'px-2' : 'px-3'} py-3 rounded text-sm font-bold transition-colors ${
                            state === 'correct' ? 'bg-green-500' :
                            state === 'present' ? 'bg-yellow-500' :
                            state === 'absent' ? 'bg-gray-700' :
                            'bg-gray-500 hover:bg-gray-400'
                          }`}
                        >
                          {key}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
            
            {/* Game Over */}
            {(myStatus !== 'playing' || opponentStatus !== 'playing') && (
              <div className="text-center mt-6">
                <button
                  onClick={resetBattle}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
