import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Clock, Brain, AlertCircle, ArrowLeft } from 'lucide-react';

interface QuizCompletedState {
  score: number;
  totalQuestions: number;
  quizTitle: string;
  timeUp: boolean;
  isAssessment: boolean;
  timeTaken: number;
  correctAnswers: number;
  submissionError?: boolean;
}

function QuizCompleted() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as QuizCompletedState;

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-red-400 text-center p-4 bg-red-500/10 rounded-lg">
          No quiz results found. Please complete a quiz first.
        </div>
      </div>
    );
  }

  const {
    score,
    totalQuestions,
    quizTitle,
    timeUp,
    isAssessment,
    timeTaken,
    correctAnswers,
    submissionError
  } = state;

  const percentage = Math.round((score / totalQuestions) * 100);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate('/quiz')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Quiz</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">{quizTitle}</h1>
            <p className="text-gray-400">Quiz Completed!</p>
          </div>

          {timeUp && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6 flex items-center space-x-3">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400">Time's up! Your quiz was automatically submitted.</span>
            </div>
          )}

          {submissionError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Failed to submit results. Your score was saved locally.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold">Score</h3>
              </div>
              <div className="text-center">
                <span className={`text-5xl font-bold ${getScoreColor()}`}>{percentage}%</span>
                <p className="text-gray-400 mt-2">{getScoreMessage()}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {correctAnswers} out of {totalQuestions} correct
                </p>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold">Time Taken</h3>
              </div>
              <div className="text-center">
                <span className="text-5xl font-bold text-blue-400">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
                <p className="text-gray-400 mt-2">Minutes:Seconds</p>
              </div>
            </div>
          </div>

          {!isAssessment && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Performance Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Accuracy</span>
                  <span className="font-medium">{percentage}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <motion.div
                    className={`h-full rounded-full ${getScoreColor().replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/quiz')}
            className="w-full mt-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
          >
            Return to Quiz Selection
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default QuizCompleted; 