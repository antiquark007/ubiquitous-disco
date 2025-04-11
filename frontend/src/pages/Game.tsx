import React from 'react';
import { Brain, Calculator, Mic, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { GameCard } from '../components/GameCard';
import { Sidebar } from '../components/Sidebar';
import { ThreeScene } from '../components/ThreeScene';

const games = [
  {
    title: "Word Adventure",
    description: "Learn fun new words with pictures!",
    path: "/games/pronunciation",
    icon: Mic
  },
  {
    title: "Number Fun",
    description: "Play with numbers and learn math!",
    path: "/games/math",
    icon: Calculator
  },
  {
    title: "Memory Match",
    description: "Find matching pairs of pictures!",
    path: "/games/memory",
    icon: Brain
  },
  {
    title: "Imagination Adventure",
    description: "Share your creative ideas!",
    path: "/games/creative",
    icon: Palette
  }
];

function Game() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState({ x: 0, y: 0 });
  
  // Track mouse position for the glow effect
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Circular Disk Pointer */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-20 blur-[300px] transition-transform duration-75"
        style={{
          transform: `translate(${cursorPosition.x - 300}px, ${cursorPosition.y - 300}px)`,
        }}
      />

      {/* Three.js Background */}
      <div className="absolute inset-0">
        <ThreeScene />
      </div>
      
      <div className="flex h-screen">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                Fun Learning Games! 🎮
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Choose a game to start your learning adventure! Each game is designed to make learning fun and engaging.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {games.map((game, index) => (
                <motion.div
                  key={game.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GameCard
                    title={game.title}
                    description={game.description}
                    path={game.path}
                    icon={<game.icon className="w-8 h-8 text-green-400" />}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Game;