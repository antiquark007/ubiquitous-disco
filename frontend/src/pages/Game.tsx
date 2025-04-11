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
  const [selectedGameIndex, setSelectedGameIndex] = React.useState<number | null>(null);
  
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

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Circular Disk Pointer with enhanced glow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-20 blur-[300px]"
        animate={{
          x: cursorPosition.x - 300,
          y: cursorPosition.y - 300,
          scale: selectedGameIndex !== null ? 1.2 : 1
        }}
        transition={{ type: "spring", damping: 15, stiffness: 50 }}
      />
      
      {/* Additional ambient glow elements */}
      <div className="fixed top-1/4 -left-20 w-80 h-80 rounded-full bg-green-500/10 blur-[100px]" />
      <div className="fixed bottom-1/3 -right-20 w-96 h-96 rounded-full bg-green-600/10 blur-[120px]" />

      {/* Three.js Background */}
      <div className="absolute inset-0">
        <ThreeScene />
      </div>
      
      <div className="flex h-screen">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        
        <main className="flex-1 overflow-hidden relative z-10">
          <div className="h-full flex flex-col p-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-8 md:mb-12"
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Fun Learning Games! 🎮
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-400 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Choose a game to start your learning adventure! Each game is designed to make learning fun and engaging.
              </motion.p>
            </motion.div>
            
            <div className="flex-grow flex items-center justify-center px-4 md:px-8 py-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl"
              >
                {games.map((game, index) => (
                  <motion.div
                    key={game.path}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.03, 
                      transition: { duration: 0.2 } 
                    }}
                    onHoverStart={() => setSelectedGameIndex(index)}
                    onHoverEnd={() => setSelectedGameIndex(null)}
                    className="h-full"
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
            
            {/* Footer with animated particles */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-auto pt-4 text-center relative h-16"
            >
              <div className="text-gray-500 text-sm">
                Explore and learn with interactive games designed for dyslexic learners
              </div>
              {/* Animated particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-green-500/30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Game;