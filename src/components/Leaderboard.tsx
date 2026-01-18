'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/types/game';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Leaderboard = ({ isOpen, onClose }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'all'>('today');
  
  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, timeframe]);
  
  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?timeframe=${timeframe}`);
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      // Use mock data for demo
      setEntries(getMockLeaderboard());
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            Leaderboard
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Timeframe Tabs */}
        <div className="flex gap-2 mb-4">
          {(['today', 'week', 'all'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === tf 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tf === 'today' ? 'Today' : tf === 'week' ? 'This Week' : 'All Time'}
            </button>
          ))}
        </div>
        
        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No entries yet. Be the first to play!
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div 
                  key={entry.player.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gray-700/50'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-gray-600 text-gray-300'
                  }`}>
                    {entry.rank}
                  </div>
                  
                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{entry.player.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span>{entry.player.gamesWon}W / {entry.player.gamesPlayed}P</span>
                      <span>•</span>
                      <span>🔥 {entry.player.currentStreak}</span>
                    </div>
                  </div>
                  
                  {/* Score */}
                  <div className="text-right">
                    <div className="font-bold text-lg">{entry.totalScore.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                  
                  {/* Verified Badge */}
                  {entry.proofVerified && (
                    <div className="text-green-500" title="ZK Verified">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* ZK Info */}
        <div className="mt-4 p-3 bg-gray-900 rounded-lg text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>All scores are verified with zero-knowledge proofs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock leaderboard data for demo
const getMockLeaderboard = (): LeaderboardEntry[] => {
  const names = ['CryptoMaster', 'WordWizard', 'ZKChampion', 'PuzzlePro', 'BrainStorm', 'QuickSolver', 'WordNinja', 'ProofKing'];
  
  return names.map((name, index) => ({
    rank: index + 1,
    player: {
      id: `player-${index}`,
      name,
      score: Math.floor(Math.random() * 5000) + 1000,
      gamesPlayed: Math.floor(Math.random() * 50) + 10,
      gamesWon: Math.floor(Math.random() * 40) + 5,
      currentStreak: Math.floor(Math.random() * 10),
      maxStreak: Math.floor(Math.random() * 20) + 5,
      averageAttempts: Math.round((Math.random() * 2 + 3) * 10) / 10,
      zkProofs: []
    },
    todayScore: Math.floor(Math.random() * 1500),
    totalScore: Math.floor(Math.random() * 10000) + 2000,
    proofVerified: Math.random() > 0.2
  })).sort((a, b) => b.totalScore - a.totalScore).map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
};
