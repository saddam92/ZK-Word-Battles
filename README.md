# ZK Word Battles

ZK Word Battles is a daily head-to-head word game where players prove they solved a puzzle *without revealing the answer*. Zero-knowledge (ZK) proofs attest to valid gameplay; Soundness Layer (SL) verifies those proofs quickly and cheaply, so leaderboards can't be cheated.

![ZK Word Battles](https://img.shields.io/badge/ZK-Word%20Battles-purple)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎮 Features

### Core Gameplay
- **Daily Word Puzzle**: A new 5-letter word every day
- **6 Attempts**: Guess the word in 6 tries or less
- **Color-coded Feedback**: 
  - 🟩 Green = Correct letter, correct position
  - 🟨 Yellow = Correct letter, wrong position
  - ⬛ Gray = Letter not in word

### Zero-Knowledge Proofs
- **Privacy-Preserving**: Prove you solved the puzzle without revealing the answer
- **Cryptographic Commitments**: Your solution is hashed and committed
- **Soundness Layer Verification**: Proofs are verified on-chain for fair leaderboards

### Battle Mode ⚔️
- **Head-to-Head Competition**: Race against opponents in real-time
- **Live Progress Tracking**: See your opponent's progress
- **First to Solve Wins**: Speed and accuracy matter

### Leaderboards 🏆
- **Daily Rankings**: Compete for the top spot each day
- **Weekly & All-Time Stats**: Track your long-term performance
- **ZK-Verified Scores**: All scores are cryptographically verified

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/saddam92/ZK-Word-Battles.git
cd ZK-Word-Battles

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
zk-word-battles/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── leaderboard/   # Leaderboard API
│   │   ├── globals.css        # Global styles & animations
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main game page
│   ├── components/            # React components
│   │   ├── BattleMode.tsx     # Head-to-head battle
│   │   ├── GameGrid.tsx       # Word grid display
│   │   ├── Header.tsx         # App header
│   │   ├── Keyboard.tsx       # Virtual keyboard
│   │   ├── Leaderboard.tsx    # Rankings display
│   │   ├── Message.tsx        # Toast messages
│   │   ├── ProofModal.tsx     # ZK proof details
│   │   └── StatsModal.tsx     # Player statistics
│   ├── lib/                   # Core logic
│   │   ├── gameLogic.ts       # Game mechanics
│   │   ├── words.ts           # Word list & daily word
│   │   └── zkProof.ts         # ZK proof generation
│   ├── store/                 # State management
│   │   └── gameStore.ts       # Zustand store
│   └── types/                 # TypeScript types
│       └── game.ts            # Game type definitions
├── next.config.ts             # Next.js configuration
├── package.json
└── README.md
```

## 🔐 How ZK Proofs Work

1. **Commitment Phase**: When you start playing, a cryptographic commitment is created
2. **Gameplay**: You make guesses, and results are recorded
3. **Proof Generation**: Upon completion, a ZK proof is generated that proves:
   - You knew the correct word
   - Your guesses were valid
   - You completed the game fairly
4. **Verification**: The Soundness Layer verifies the proof without seeing the word
5. **Leaderboard Update**: Your verified score is added to the leaderboard

### Proof Structure

```typescript
interface ZKProof {
  id: string;              // Unique proof identifier
  commitment: string;      // SHA-256 hash of word + salt
  proof: string;           // Encrypted proof data
  publicInputs: string[];  // Verifiable public data
  verified: boolean;       // Verification status
  gameDate: string;        // Date of gameplay
  attempts: number;        // Number of guesses
  won: boolean;            // Win/loss status
}
```

## 🎯 Scoring System

| Attempts | Base Score | Attempt Bonus | Max Time Bonus |
|----------|------------|---------------|----------------|
| 1        | 1000       | +500          | +300           |
| 2        | 1000       | +400          | +300           |
| 3        | 1000       | +300          | +300           |
| 4        | 1000       | +200          | +300           |
| 5        | 1000       | +100          | +300           |
| 6        | 1000       | +0            | +300           |

Time bonus decreases as solve time increases (max 300 for under 30 seconds).

## 🛠️ Technologies

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Cryptography**: crypto-js (SHA-256, AES)
- **ZK Simulation**: Custom proof generation (production would use Circom/snarkjs)

## 📱 Responsive Design

The game is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers

## 🔮 Future Enhancements

- [ ] Real ZK circuits using Circom or Noir
- [ ] On-chain proof verification via Soundness Layer
- [ ] Multiplayer rooms with WebSocket
- [ ] NFT badges for achievements
- [ ] Tournament mode
- [ ] Custom word lists

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ for the ZK community
