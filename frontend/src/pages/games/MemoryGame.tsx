import React, { useState, useEffect, useRef } from 'react';
import type { MemoryCard } from '../../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const initialCards: MemoryCard[] = [
  { id: 1, word: "sun", imageUrl: "https://images.unsplash.com/photo-1575881875475-31023242e3f9?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 2, word: "sun", imageUrl: "https://images.unsplash.com/photo-1575881875475-31023242e3f9?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 3, word: "tree", imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 4, word: "tree", imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 5, word: "moon", imageUrl: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 6, word: "moon", imageUrl: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 7, word: "star", imageUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 8, word: "star", imageUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 9, word: "cloud", imageUrl: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 10, word: "cloud", imageUrl: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 11, word: "flower", imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
  { id: 12, word: "flower", imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=200&h=200", isFlipped: false, isMatched: false },
].sort(() => Math.random() - 0.5);

export const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<MemoryCard[]>(initialCards);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [lastMoveTime, setLastMoveTime] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const [playerName, setPlayerName] = useState<string>("Player");
  const [playerAge, setPlayerAge] = useState<string>("");
  const [playerGender, setPlayerGender] = useState<string>("");
  const [playerEmail, setPlayerEmail] = useState<string>("");
  const [showPlayerForm, setShowPlayerForm] = useState<boolean>(true);

  // Start the game timer
  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setGameTime(0);
    setMoves(0);
    setResponseTimes([]);
    setLastMoveTime(null);
    setCards(initialCards.sort(() => Math.random() - 0.5));
    setMatches(0);
    setShowPlayerForm(false);
    
    // Start the timer
    timerRef.current = window.setInterval(() => {
      setGameTime(prevTime => prevTime + 1);
    }, 1000);
  };

  // Calculate average response time
  const calculateAverageResponseTime = () => {
    if (responseTimes.length === 0) return 0;
    const sum = responseTimes.reduce((acc, time) => acc + time, 0);
    return Math.round(sum / responseTimes.length);
  };

  // Calculate accuracy (matches / moves)
  const calculateAccuracy = () => {
    if (moves === 0) return 0;
    return Math.round((matches / moves) * 100);
  };

  // Calculate performance rating based on time, moves, and accuracy
  const calculatePerformanceRating = () => {
    const accuracy = calculateAccuracy();
    const avgResponseTime = calculateAverageResponseTime();
    
    // Simple rating algorithm
    let rating = "Excellent";
    
    if (accuracy < 70) {
      rating = "Needs Improvement";
    } else if (accuracy < 85) {
      rating = "Good";
    } else if (avgResponseTime > 2000) {
      rating = "Very Good";
    }
    
    return rating;
  };

  // Calculate memory efficiency score
  const calculateMemoryEfficiency = () => {
    const accuracy = calculateAccuracy();
    const avgResponseTime = calculateAverageResponseTime();
    const timePerMove = gameTime / (moves || 1);
    
    // Higher score is better (max 100)
    let score = 100;
    
    // Penalize for low accuracy
    score -= (100 - accuracy) * 0.5;
    
    // Penalize for slow response time
    if (avgResponseTime > 2000) {
      score -= (avgResponseTime - 2000) / 100;
    }
    
    // Penalize for slow time per move
    if (timePerMove > 5) {
      score -= (timePerMove - 5) * 2;
    }
    
    return Math.max(0, Math.round(score));
  };

  // Calculate cognitive load index
  const calculateCognitiveLoadIndex = () => {
    const accuracy = calculateAccuracy();
    const avgResponseTime = calculateAverageResponseTime();
    
    // Higher index means higher cognitive load (max 10)
    let index = 10;
    
    // Reduce index for high accuracy
    index -= accuracy / 20;
    
    // Reduce index for fast response time
    if (avgResponseTime < 1500) {
      index -= 2;
    } else if (avgResponseTime < 2000) {
      index -= 1;
    }
    
    return Math.max(1, Math.round(index * 10) / 10);
  };

  const handleCardClick = (cardId: number) => {
    // Start the game if it hasn't started yet
    if (!gameStarted) {
      startGame();
    }
    
    // Prevent clicking if already processing a flip or if card is already flipped/matched
    if (isProcessing) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched || card.isFlipped) return;

    // Set processing flag to prevent multiple clicks
    setIsProcessing(true);

    // Increment moves counter
    setMoves(prevMoves => prevMoves + 1);

    // Calculate response time if this is the second card
    if (flippedCards.length === 1 && lastMoveTime !== null) {
      const currentTime = Date.now();
      const responseTime = currentTime - lastMoveTime;
      setResponseTimes(prevTimes => [...prevTimes, responseTime]);
    }

    // Update last move time
    setLastMoveTime(Date.now());

    // Flip the clicked card
    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    // If this is the first card being flipped
    if (flippedCards.length === 0) {
      setFlippedCards([cardId]);
      setIsProcessing(false);
    } else {
      // This is the second card being flipped
      const firstCard = cards.find(c => c.id === flippedCards[0]);
      
      if (firstCard && firstCard.word === card.word) {
        // Match found
        setTimeout(() => {
          setCards(cards.map(c => 
            (c.id === cardId || c.id === flippedCards[0])
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          ));
          setMatches(matches + 1);
          setFlippedCards([]);
          setIsProcessing(false);
        }, 500);
      } else {
        // No match - automatically flip cards back after a delay
        setTimeout(() => {
          setCards(cards.map(c => 
            (c.id === cardId || c.id === flippedCards[0])
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matches === initialCards.length / 2) {
      // Game completed
      setGameCompleted(true);
      
      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [matches]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Prepare data for the pie chart
  const getPieChartData = () => {
    const accuracy = calculateAccuracy();
    return {
      labels: ['Correct Matches', 'Incorrect Attempts'],
      datasets: [
        {
          data: [accuracy, 100 - accuracy],
          backgroundColor: [
            'rgba(0, 255, 0, 0.6)',
            'rgba(255, 0, 0, 0.6)',
          ],
          borderColor: [
            'rgba(0, 255, 0, 1)',
            'rgba(255, 0, 0, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Get current date and time for the report
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  // Handle player form submission
  const handlePlayerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startGame();
  };

  // Render the game or report based on game state
  const renderContent = () => {
    if (showPlayerForm) {
      return (
        <div className="bg-black border border-green-500 shadow-lg rounded-lg p-6 mb-8 text-green-400">
          <h3 className="text-2xl font-bold text-center mb-4">Player Information</h3>
          <form onSubmit={handlePlayerFormSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Name:</label>
              <input 
                type="text" 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-green-500 rounded text-green-400"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Age:</label>
              <input 
                type="text" 
                value={playerAge} 
                onChange={(e) => setPlayerAge(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-green-500 rounded text-green-400"
              />
            </div>
            <div>
              <label className="block mb-1">Gender:</label>
              <select 
                value={playerGender} 
                onChange={(e) => setPlayerGender(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-green-500 rounded text-green-400"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Email (optional):</label>
              <input 
                type="email" 
                value={playerEmail} 
                onChange={(e) => setPlayerEmail(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-green-500 rounded text-green-400"
              />
            </div>
            <div className="text-center">
              <button 
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                Start Game
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (gameCompleted) {
      return (
        <div className="bg-black border border-green-500 shadow-lg rounded-lg p-6 mb-8 text-green-400">
          <div className="border-b border-green-500 pb-4 mb-4">
            <h3 className="text-2xl font-bold text-center">Memory Game Performance Report</h3>
            <p className="text-center text-green-500">Generated on {getCurrentDateTime()}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-green-500">
              <h4 className="text-xl font-semibold mb-3">Player Information</h4>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{playerName}</span>
                </p>
                {playerAge && (
                  <p className="flex justify-between">
                    <span className="font-medium">Age:</span>
                    <span>{playerAge}</span>
                  </p>
                )}
                {playerGender && (
                  <p className="flex justify-between">
                    <span className="font-medium">Gender:</span>
                    <span>{playerGender}</span>
                  </p>
                )}
                {playerEmail && (
                  <p className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{playerEmail}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-green-500">
              <h4 className="text-xl font-semibold mb-3">Performance Summary</h4>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="font-medium">Total Time:</span>
                  <span>{formatTime(gameTime)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Total Moves:</span>
                  <span>{moves}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Accuracy:</span>
                  <span>{calculateAccuracy()}%</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Avg Response Time:</span>
                  <span>{calculateAverageResponseTime()}ms</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Memory Efficiency:</span>
                  <span>{calculateMemoryEfficiency()}/100</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Cognitive Load Index:</span>
                  <span>{calculateCognitiveLoadIndex()}/10</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Performance Rating:</span>
                  <span className="font-bold text-green-500">{calculatePerformanceRating()}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-green-500 flex flex-col items-center justify-center">
              <h4 className="text-xl font-semibold mb-3">Accuracy Chart</h4>
              <div className="w-full max-w-xs">
                <Pie data={getPieChartData()} options={{ 
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: '#4ade80'
                      }
                    }
                  }
                }} />
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-green-500">
              <h4 className="text-xl font-semibold mb-3">Response Time Analysis</h4>
              <div className="space-y-2">
                <p className="mb-2">
                  Your average response time was <span className="font-bold">{calculateAverageResponseTime()}ms</span>.
                </p>
                <p className="mb-2">
                  {calculateAverageResponseTime() < 1000 
                    ? "Excellent reaction time! You're processing information very quickly." 
                    : calculateAverageResponseTime() < 1500 
                      ? "Good reaction time. You're processing information at a good pace." 
                      : calculateAverageResponseTime() < 2000 
                        ? "Average reaction time. There's room for improvement in processing speed." 
                        : "Slow reaction time. Consider practicing to improve your processing speed."}
                </p>
                <p className="mb-2">
                  {responseTimes.length > 0 && (
                    <>
                      Fastest response: <span className="font-bold">{Math.min(...responseTimes)}ms</span><br />
                      Slowest response: <span className="font-bold">{Math.max(...responseTimes)}ms</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg border border-green-500 mb-6">
            <h4 className="text-xl font-semibold mb-3">Performance Analysis</h4>
            <p className="mb-2">
              You completed the memory game in <span className="font-bold">{formatTime(gameTime)}</span> with 
              <span className="font-bold"> {moves} </span> moves and an accuracy of 
              <span className="font-bold"> {calculateAccuracy()}%</span>.
            </p>
            <p className="mb-2">
              Your memory efficiency score is <span className="font-bold">{calculateMemoryEfficiency()}/100</span>, 
              which {calculateMemoryEfficiency() > 80 
                ? "indicates excellent memory performance" 
                : calculateMemoryEfficiency() > 60 
                  ? "indicates good memory performance" 
                  : "suggests room for improvement in memory efficiency"}.
            </p>
            <p className="mb-2">
              Your cognitive load index is <span className="font-bold">{calculateCognitiveLoadIndex()}/10</span>, 
              which {calculateCognitiveLoadIndex() < 4 
                ? "indicates low cognitive load - you found the task relatively easy" 
                : calculateCognitiveLoadIndex() < 7 
                  ? "indicates moderate cognitive load - the task was appropriately challenging" 
                  : "indicates high cognitive load - you found the task quite challenging"}.
            </p>
            <p className="mb-2">
              Overall performance rating: <span className="font-bold text-green-500">{calculatePerformanceRating()}</span>
            </p>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg border border-green-500 mb-6">
            <h4 className="text-xl font-semibold mb-3">Recommendations</h4>
            <ul className="list-disc pl-5 space-y-1">
              {calculateAccuracy() < 80 && (
                <li>Practice memory games regularly to improve accuracy.</li>
              )}
              {calculateAverageResponseTime() > 1500 && (
                <li>Try to make decisions more quickly to improve response time.</li>
              )}
              {calculateMemoryEfficiency() < 70 && (
                <li>Consider using memory techniques like chunking or visualization.</li>
              )}
              {calculateCognitiveLoadIndex() > 7 && (
                <li>Break down complex tasks into smaller parts to reduce cognitive load.</li>
              )}
              <li>Regular exercise and good sleep can improve cognitive performance.</li>
              <li>Consider trying more challenging memory games to further develop your skills.</li>
            </ul>
          </div>
          
          <div className="text-center">
            <button 
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Play Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              Memory Match
            </h2>
            <p className="text-xl text-gray-400">
              Find all matching pairs of cards!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-green-500/20"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="text-xl text-gray-300">
                Moves: <span className="text-green-400">{moves}</span>
              </div>
              <button
                onClick={startGame}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-lg transition-all transform hover:scale-105"
              >
                New Game
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {cards.map(card => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square rounded-lg cursor-pointer ${
                    card.isMatched ? 'opacity-50' : ''
                  }`}
                >
                  <AnimatePresence>
                    {card.isFlipped ? (
                      <motion.div
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-4xl"
                      >
                        {card.word}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: -90 }}
                        className="w-full h-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-green-500/30"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {gameCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 text-center"
              >
                <h3 className="text-3xl font-bold text-green-400 mb-4">
                  Congratulations! 🎉
                </h3>
                <p className="text-xl text-gray-300">
                  You completed the game in {moves} moves!
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};