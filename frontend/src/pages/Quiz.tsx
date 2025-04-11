import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Trophy, Clock } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { ThreeScene } from '../components/ThreeScene';

interface QuizLevel {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  questions: number;
  icon: React.ReactNode;
}

function Quiz() {
  const [, setSelectedLevel] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [quizLevels, setQuizLevels] = useState<QuizLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Track mouse position for the glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const fetchQuizLevels = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dylexiaai.onrender.com/quizzes', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch quiz levels: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        const transformedData = data.map((level: any) => ({
          ...level,
          icon: level.icon === 'Brain' ? <Brain className="w-6 h-6 text-green-400" /> :
                level.icon === 'Target' ? <Target className="w-6 h-6 text-yellow-400" /> :
                <Trophy className="w-6 h-6 text-red-400" />
        }));
        
        setQuizLevels(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching quiz levels:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching quiz levels');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizLevels();
  }, []);

  const handleStartQuiz = (levelId: number) => {
    setSelectedLevel(levelId);
    navigate(`/quiz/${levelId}`);
  };

  return (
    <div className="flex h-screen bg-black text-white relative overflow-hidden">
      {/* Circular Disk Pointer */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-15 blur-[200px] transition-transform duration-75"
        style={{
          transform: `translate(${cursorPosition.x - 300}px, ${cursorPosition.y - 300}px)`,
        }}
      ></div>

      {/* Three.js Background */}
      <div className="absolute inset-0">
        <ThreeScene />
      </div>
      
      {/* Use the shared Sidebar component */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
            Quiz Levels
          </h1>
          <p className="text-gray-400 mb-8">
            Choose a level to test your knowledge. Each level has different difficulty and time constraints.
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center p-4 bg-red-500/10 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizLevels.map((level) => (
                <motion.div
                  key={level.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {level.icon}
                      <h2 className="text-xl font-semibold">{level.title}</h2>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      level.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      level.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {level.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-6">{level.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{level.timeLimit} mins</span>
                    </div>
                    <span>{level.questions} questions</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStartQuiz(level.id)}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
                  >
                    Start Quiz
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default Quiz;