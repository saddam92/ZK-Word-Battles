import { NextRequest, NextResponse } from 'next/server';
import { Player, ZKProof, LeaderboardEntry } from '@/types/game';
import { verifyZKProof } from '@/lib/zkProof';

// In-memory storage for demo (use a database in production)
const leaderboardData: Map<string, { player: Player; proof: ZKProof }> = new Map();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const timeframe = searchParams.get('timeframe') || 'today';
  
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;
  
  let entries: LeaderboardEntry[] = [];
  
  leaderboardData.forEach(({ player, proof }) => {
    // Filter by timeframe
    if (timeframe === 'today' && now - proof.timestamp > dayMs) return;
    if (timeframe === 'week' && now - proof.timestamp > weekMs) return;
    
    entries.push({
      rank: 0,
      player,
      todayScore: proof.won ? 1000 + (6 - proof.attempts) * 100 : 0,
      totalScore: player.score,
      proofVerified: proof.verified
    });
  });
  
  // Sort by score and assign ranks
  entries.sort((a, b) => b.totalScore - a.totalScore);
  entries = entries.map((entry, index) => ({ ...entry, rank: index + 1 }));
  
  return NextResponse.json({ entries: entries.slice(0, 100) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player, proof } = body as { player: Player; proof: ZKProof };
    
    if (!player || !proof) {
      return NextResponse.json({ error: 'Missing player or proof' }, { status: 400 });
    }
    
    // Verify the proof
    const isValid = verifyZKProof(proof);
    proof.verified = isValid;
    
    // Store in leaderboard
    leaderboardData.set(player.id, { player, proof });
    
    return NextResponse.json({ 
      success: true, 
      verified: isValid,
      message: isValid ? 'Proof verified and score recorded' : 'Proof verification failed'
    });
  } catch (error) {
    console.error('Leaderboard POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
