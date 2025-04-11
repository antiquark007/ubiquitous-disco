import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Trophy, Clock, LayoutDashboard, BookOpen, Brain as BrainIcon, LogOut, ChevronLeft, ChevronRight, Activity, Users, BarChart2, User } from 'lucide-react';

interface QuizLevel {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  questions: number;
  icon: React.ReactNode;
}

function Sidebar({ isCollapsed, toggleSidebar }: { isCollapsed: boolean; toggleSidebar: () => void }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: BookOpen, label: 'Quiz', active: true },
    { icon: BrainIcon, label: 'Progress Tracking' },
    { icon: Activity, label: 'Activities' },
    { icon: Users, label: 'Community' },
    { icon: BarChart2, label: 'Analytics' },
    { icon: User, label: 'Profile', onClick: () => navigate('/profile') },
  ];

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 250 }}
      animate={{ width: isCollapsed ? 80 : 250 }}
      className="h-screen bg-black/50 backdrop-blur-lg border-r border-green-500/10 flex flex-col relative z-10"
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-2xl font-bold text-green-400">DyslexiaAI</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-green-500/10 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5 text-green-400" /> : <ChevronLeft className="w-5 h-5 text-green-400" />}
        </button>
      </div>

      <nav className="flex-1 mt-8">
        {menuItems.map(({ icon: Icon, label, active, onClick }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center p-4 space-x-4 text-left transition-colors ${
              active ? 'bg-green-500/10 text-green-400' : 'text-white/80 hover:bg-green-500/5'
            }`}
            onClick={onClick}
          >
            <Icon className="w-5 h-5" />
            {!isCollapsed && <span>{label}</span>}
          </motion.button>
        ))}
      </nav>

      <div className="p-4 border-t border-green-500/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center space-x-4 text-white/80 hover:text-green-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </motion.div>
  );
}

function Quiz() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [quizLevels, setQuizLevels] = useState<QuizLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizLevels = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dylexia.onrender.com/quizzes', {
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
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
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
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm"
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
