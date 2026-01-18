'use client';

import { useGameStore } from '@/store/gameStore';
import { generateProofSummary, generateSLProof } from '@/lib/zkProof';

export const ProofModal = () => {
  const { showProof, setShowProof, currentProof } = useGameStore();
  
  if (!showProof || !currentProof) return null;
  
  const slProof = generateSLProof(currentProof);
  const summary = generateProofSummary(currentProof);
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            ZK Proof Details
          </h2>
          <button 
            onClick={() => setShowProof(false)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Proof Status */}
        <div className={`p-4 rounded-lg mb-4 ${currentProof.verified ? 'bg-green-900/50 border border-green-600' : 'bg-yellow-900/50 border border-yellow-600'}`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentProof.verified ? '✅' : '⏳'}</span>
            <div>
              <div className="font-bold">{currentProof.verified ? 'Proof Verified' : 'Verification Pending'}</div>
              <div className="text-sm text-gray-300">
                {currentProof.verified 
                  ? 'Your gameplay has been cryptographically verified by the Soundness Layer'
                  : 'Your proof is being verified by the Soundness Layer'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Game Result */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-bold text-gray-400 mb-2">GAME RESULT</h3>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{currentProof.won ? '🏆' : '❌'}</span>
            <div>
              <div className="text-2xl font-bold">
                {currentProof.won ? `Won in ${currentProof.attempts} attempts` : 'Better luck next time!'}
              </div>
              <div className="text-sm text-gray-400">{currentProof.gameDate}</div>
            </div>
          </div>
        </div>
        
        {/* Proof Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-2">COMMITMENT HASH</h3>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm break-all text-purple-400">
              {currentProof.commitment}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This hash commits to your solution without revealing the word
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-2">PUBLIC INPUTS</h3>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-1">
              {currentProof.publicInputs.map((input, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-500">
                    {['commitment', 'attempts', 'won', 'timestamp'][i]}:
                  </span>
                  <span className="text-blue-400 break-all ml-2">
                    {i === 2 ? (input === '1' ? 'true' : 'false') : 
                     i === 3 ? new Date(parseInt(input)).toLocaleString() : 
                     input.length > 20 ? `${input.slice(0, 20)}...` : input}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-2">PROOF ID</h3>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-300">
              {currentProof.id}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(slProof, null, 2));
              alert('Proof copied to clipboard!');
            }}
            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Proof
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ text: summary });
              } else {
                navigator.clipboard.writeText(summary);
                alert('Summary copied to clipboard!');
              }
            }}
            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
        
        {/* Soundness Layer Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-700/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <div>
              <h4 className="font-bold text-sm">Verified by Soundness Layer</h4>
              <p className="text-xs text-gray-400 mt-1">
                Zero-knowledge proofs are verified quickly and cheaply on the Soundness Layer, 
                ensuring that leaderboard rankings cannot be cheated or manipulated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
