import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const questionsByLevel: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      question: "Which word is spelled correctly?",
      options: ["Hapy", "Happy", "Happi", "Happie"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Choose the correct sentence:",
      options: ["I goed to the store", "I went to the store", "I gone to the store", "I going to the store"],
      correctAnswer: 1
    },
    // Add more questions for level 1
  ],
  2: [
    {
      id: 1,
      question: "Which word is the antonym of 'happy'?",
      options: ["Joyful", "Sad", "Excited", "Content"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Identify the correct plural form:",
      options: ["Childs", "Children", "Childes", "Child"],
      correctAnswer: 1
    },
    // Add more questions for level 2
  ],
  3: [
    {
      id: 1,
      question: "Which sentence uses the correct tense?",
      options: ["She will went to the store", "She will go to the store", "She will going to the store", "She will gone to the store"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Choose the correct spelling:",
      options: ["Accommodation", "Acommodation", "Accomodation", "Acomodation"],
      correctAnswer: 0
    },
    // Add more questions for level 3
  ]
};

function QuizQuestions() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const questions = questionsByLevel[Number(levelId)] || [];
  const totalQuestions = questions.length;

  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsQuizComplete(true);
    }
  }, [timeLeft, isQuizComplete]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isQuizComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm"
          >
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              Quiz Complete!
            </h2>
            <div className="text-center mb-8">
              <p className="text-4xl font-bold mb-2">{score}/{totalQuestions}</p>
              <p className="text-gray-400">Your Score</p>
            </div>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/quiz')}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Back to Levels
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
              >
                Go to Dashboard
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/quiz')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Levels</span>
          </motion.button>
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm"
        >
          <div className="mb-6">
            <span className="text-gray-400">Question {currentQuestion + 1} of {totalQuestions}</span>
            <h2 className="text-2xl font-bold mt-2">{questions[currentQuestion].question}</h2>
          </div>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !showResult && handleAnswerSelect(index)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  showResult
                    ? index === questions[currentQuestion].correctAnswer
                      ? 'bg-green-500/20 border-green-500'
                      : selectedAnswer === index
                      ? 'bg-red-500/20 border-red-500'
                      : 'bg-gray-700/50 border-gray-600'
                    : selectedAnswer === index
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                } border`}
              >
                <div className="flex items-center space-x-4">
                  {showResult && (
                    index === questions[currentQuestion].correctAnswer ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : null
                  )}
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {showResult && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextQuestion}
              className="w-full mt-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
            >
              {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default QuizQuestions; 