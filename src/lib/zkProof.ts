import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { ZKProof, GuessResult } from '@/types/game';

// ZK Proof Generation System
// This simulates a zero-knowledge proof system for word game verification
// In production, this would use actual ZK circuits (e.g., Circom, Noir, or Halo2)

interface ProofInput {
  targetWordHash: string;
  guesses: GuessResult[];
  playerSalt: string;
  timestamp: number;
}

// Generate a commitment to the game result without revealing the word
export const generateCommitment = (
  targetWord: string,
  playerSalt: string
): string => {
  const data = `${targetWord}:${playerSalt}`;
  return CryptoJS.SHA256(data).toString();
};

// Generate a ZK proof that the player solved the puzzle correctly
export const generateZKProof = (
  playerId: string,
  targetWord: string,
  guesses: GuessResult[],
  won: boolean
): ZKProof => {
  const timestamp = Date.now();
  const playerSalt = CryptoJS.lib.WordArray.random(16).toString();
  
  // Generate commitment (hash of word + salt)
  const commitment = generateCommitment(targetWord, playerSalt);
  
  // Generate proof data
  // In a real ZK system, this would be a cryptographic proof
  // that proves knowledge of the word without revealing it
  const proofInput: ProofInput = {
    targetWordHash: CryptoJS.SHA256(targetWord).toString(),
    guesses,
    playerSalt,
    timestamp
  };
  
  // Simulate proof generation
  const proofData = {
    // Public inputs (can be verified by anyone)
    wordCommitment: commitment,
    guessCount: guesses.length,
    won,
    timestamp,
    
    // Proof components (simulated)
    pi_a: generateRandomHex(64),
    pi_b: [generateRandomHex(64), generateRandomHex(64)],
    pi_c: generateRandomHex(64),
    
    // Protocol identifier
    protocol: 'groth16',
    curve: 'bn128'
  };
  
  const proof = CryptoJS.AES.encrypt(
    JSON.stringify(proofData),
    playerSalt
  ).toString();
  
  // Public inputs that can be verified
  const publicInputs = [
    commitment,
    guesses.length.toString(),
    won ? '1' : '0',
    timestamp.toString()
  ];
  
  const gameDate = new Date().toISOString().split('T')[0];
  
  return {
    id: uuidv4(),
    playerId,
    timestamp,
    commitment,
    proof,
    publicInputs,
    verified: false,
    gameDate,
    attempts: guesses.length,
    won
  };
};

// Verify a ZK proof (simulated verification)
export const verifyZKProof = (zkProof: ZKProof): boolean => {
  try {
    // In a real system, this would verify the cryptographic proof
    // against the public inputs using the verification key
    
    // Basic validation checks
    if (!zkProof.commitment || zkProof.commitment.length !== 64) {
      return false;
    }
    
    if (!zkProof.proof || zkProof.proof.length < 10) {
      return false;
    }
    
    if (zkProof.publicInputs.length !== 4) {
      return false;
    }
    
    // Verify timestamp is reasonable (within last 24 hours)
    const now = Date.now();
    const proofTime = zkProof.timestamp;
    if (proofTime > now || now - proofTime > 24 * 60 * 60 * 1000) {
      return false;
    }
    
    // Verify attempts are within valid range
    if (zkProof.attempts < 1 || zkProof.attempts > 6) {
      return false;
    }
    
    // Simulate verification delay (real ZK verification takes time)
    // In production, this would call the Soundness Layer for verification
    
    return true;
  } catch {
    return false;
  }
};

// Generate proof for Soundness Layer submission
export const generateSLProof = (zkProof: ZKProof): object => {
  return {
    proofId: zkProof.id,
    commitment: zkProof.commitment,
    publicInputs: zkProof.publicInputs,
    proof: zkProof.proof,
    metadata: {
      gameDate: zkProof.gameDate,
      attempts: zkProof.attempts,
      won: zkProof.won,
      timestamp: zkProof.timestamp
    }
  };
};

// Helper function to generate random hex strings
const generateRandomHex = (length: number): string => {
  return CryptoJS.lib.WordArray.random(length / 2).toString();
};

// Calculate score based on attempts and time
export const calculateScore = (
  won: boolean,
  attempts: number,
  timeMs: number
): number => {
  if (!won) return 0;
  
  // Base score for winning
  const baseScore = 1000;
  
  // Bonus for fewer attempts (max 500 bonus for 1 attempt)
  const attemptBonus = Math.max(0, (6 - attempts) * 100);
  
  // Time bonus (max 300 for under 30 seconds)
  const timeSeconds = timeMs / 1000;
  const timeBonus = Math.max(0, Math.floor(300 - timeSeconds * 2));
  
  return baseScore + attemptBonus + timeBonus;
};

// Generate a shareable proof summary
export const generateProofSummary = (zkProof: ZKProof): string => {
  const status = zkProof.won ? '🏆' : '❌';
  const attempts = zkProof.won ? `${zkProof.attempts}/6` : 'X/6';
  const verified = zkProof.verified ? '✅ Verified' : '⏳ Pending';
  
  return `ZK Word Battles ${zkProof.gameDate}
${status} ${attempts}
${verified}
Proof: ${zkProof.commitment.slice(0, 16)}...`;
};
