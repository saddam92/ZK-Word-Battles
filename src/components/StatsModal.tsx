'use client';

import { useGameStore } from '@/store/gameStore';
import { calculateWinPercentage } from '@/lib/gameLogic';

export const StatsModal = () => {
  const { showStats, setShowStats, stats, currentProof, setShowProof } = useGameStore();
  
  if (!showStats) return null;
  
  const winPercentage = calculateWinPercentage(stats.gamesWon, stats.gamesPlayed);
  const maxDistribution = Math.max(...stats.guessDistribution, 1);
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Statistics</h2>
          <button 
            onClick={() => setShowStats(false)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.gamesPlayed}</div>
            <div className="text-xs text-gray-400">Played</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{winPercentage}</div>
            <div className="text-xs text-gray-400">Win %</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.currentStreak}</div>
            <div className="text-xs text-gray-400">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.maxStreak}</div>
            <div className="text-xs text-gray-400">Max Streak</div>
          </div>
        </div>
        
        {/* Guess Distribution */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 text-gray-300">GUESS DISTRIBUTION</h3>
          <div className="space-y-1">
            {stats.guessDistribution.map((count, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 text-sm">{index + 1}</div>
                <div 
                  className="bg-gray-600 h-5 flex items-center justify-end px-2 text-sm font-bold transition-all duration-500"
                  style={{ 
                    width: `${Math.max((count / maxDistribution) * 100, 8)}%`,
                    backgroundColor: count > 0 ? '#22c55e' : '#4b5563'
                  }}
                >
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* ZK Proof Status */}
        {currentProof && (
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-300">TODAY&apos;S ZK PROOF</h3>
              <span className={`text-xs px-2 py-1 rounded ${currentProof.verified ? 'bg-green-600' : 'bg-yellow-600'}`}>
                {currentProof.verified ? '✓ Verified' : '⏳ Pending'}
              </span>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono break-all">
              <div className="text-gray-400 mb-1">Commitment:</div>
              <div className="text-purple-400">{currentProof.commitment}</div>
            </div>
            
            <button
              onClick={() => {
                setShowStats(false);
                setShowProof(true);
              }}
              className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors text-sm"
            >
              View Full Proof
            </button>
          </div>
        )}
        
        {/* Share Button */}
        <button
          onClick={() => {
            const shareText = `ZK Word Battles ${new Date().toLocaleDateString()}
${currentProof?.won ? `🏆 ${currentProof.attempts}/6` : '❌ X/6'}
${currentProof?.verified ? '✅ ZK Verified' : ''}

Play at: ${window.location.origin}`;
            
            if (navigator.share) {
              navigator.share({ text: shareText });
            } else {
              navigator.clipboard.writeText(shareText);
              alert('Copied to clipboard!');
            }
          }}
          className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};
