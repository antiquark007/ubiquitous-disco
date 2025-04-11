import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, ChevronLeft, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  explanation?: string;
}

interface QuizData {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  questions: number;
  icon: string;
  question_list: Question[];
}

function QuizQuestion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [userResponses, setUserResponses] = useState<Record<number, string>>({});

  const isAssessment = id === '4' || id === '5';

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dylexia.onrender.com/quiz/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch quiz: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setQuizData(data);
        setTimeLeft(data.timeLimit * 60);
        setError(null);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching the quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && quizData) {
      navigate('/quiz-completed', {
        state: {
          score,
          totalQuestions: quizData.question_list.length,
          quizTitle: quizData.title,
          timeUp: true,
          isAssessment,
          userResponses
        }
      });
    }
  }, [timeLeft, navigate, score, quizData, isAssessment, userResponses]);

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption || answeredQuestions.has(currentQuestionIndex)) return;
    
    setSelectedOption(optionId);
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex));
    setUserResponses(prev => ({ ...prev, [currentQuestionIndex]: optionId }));
    
    if (!isAssessment) {
      const currentQuestion = quizData?.question_list[currentQuestionIndex];
      if (currentQuestion) {
        const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
        if (selectedOption?.isCorrect) {
          setScore(prev => prev + 1);
        }
      }
    }
    
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quizData?.question_list.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      navigate('/quiz-completed', {
        state: {
          score,
          totalQuestions: quizData?.question_list.length,
          quizTitle: quizData?.title,
          timeUp: false,
          isAssessment,
          userResponses
        }
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-red-400 text-center p-4 bg-red-500/10 rounded-lg">
          {error || 'Failed to load quiz'}
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.question_list[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.question_list.length) * 100;
  const isQuestionAnswered = answeredQuestions.has(currentQuestionIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/quiz')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Quiz</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
            </div>
            {!isAssessment && (
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-green-400" />
                <span>{score}/{quizData.question_list.length}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="h-2 bg-gray-700 rounded-full">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Question {currentQuestionIndex + 1} of {quizData.question_list.length}</span>
            <span>{quizData.difficulty}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-semibold mb-6">{currentQuestion.text}</h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrect = option.isCorrect;
                const showResult = !isAssessment && isQuestionAnswered && (isSelected || option.isCorrect);

                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={isQuestionAnswered}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      showResult
                        ? isCorrect
                          ? 'bg-green-500/20 border-green-500'
                          : isSelected
                          ? 'bg-red-500/20 border-red-500'
                          : 'bg-gray-700/50 border-gray-600'
                        : isSelected
                        ? 'bg-blue-500/20 border-blue-500'
                        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70'
                    } border`}
                  >
                    <div className="flex items-center space-x-4">
                      {showResult ? (
                        isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : isSelected ? (
                          <XCircle className="w-6 h-6 text-red-400" />
                        ) : null
                      ) : null}
                      <span>{option.text}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {showExplanation && currentQuestion.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gray-700/30 rounded-lg"
              >
                <p className="text-gray-300">{currentQuestion.explanation}</p>
              </motion.div>
            )}

            {isQuestionAnswered && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextQuestion}
                className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>
                  {currentQuestionIndex < quizData.question_list.length - 1 
                    ? 'Next Question' 
                    : isAssessment 
                      ? 'View Assessment Results' 
                      : 'Finish Quiz'
                  }
                </span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default QuizQuestion; 