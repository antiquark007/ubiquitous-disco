import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Brain, Calculator, Mic, Palette } from 'lucide-react';
import { GameCard } from './components/GameCard';
import { PronunciationGame } from './games/PronunciationGame';
import { MathGame } from './games/MathGame';
import { MemoryGame } from './games/MemoryGame';
import { CreativeThinkingGame } from './games/CreativeThinkingGame';
import './styles.css';

const games = [
  {
    title: "Word Adventure",
    description: "Learn fun new words with pictures!",
    path: "/pronunciation",
    icon: Mic
  },
  {
    title: "Number Fun",
    description: "Play with numbers and learn math!",
    path: "/math",
    icon: Calculator
  },
  {
    title: "Memory Match",
    description: "Find matching pairs of pictures!",
    path: "/memory",
    icon: Brain
  },
  {
    title: "Imagination Adventure",
    description: "Share your creative ideas!",
    path: "/creative",
    icon: Palette
  }
];

function App() {
  React.useEffect(() => {
    const welcomeMessage = `Welcome to Fun Learning Games! We have ${games.length} exciting games for you to play. ${games.map(game => game.title + ": " + game.description).join(". ")}. Move your mouse over any game to learn more about it!`;
    const utterance = new SpeechSynthesisUtterance(welcomeMessage);
    window.speechSynthesis.speak(utterance);

    // Prevent zooming on mobile devices
    document.documentElement.style.touchAction = 'none';
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1 className="text-4xl font-bold text-green-400">
            Fun Learning Games! 🎮
          </h1>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <div className="fade-in">
                <div className="card-grid">
                  {games.map((game) => (
                    <GameCard
                      key={game.path}
                      title={game.title}
                      description={game.description}
                      path={game.path}
                    />
                  ))}
                </div>
              </div>
            } />
            <Route path="/pronunciation" element={<PronunciationGame />} />
            <Route path="/math" element={<MathGame />} />
            <Route path="/memory" element={<MemoryGame />} />
            <Route path="/creative" element={<CreativeThinkingGame />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;