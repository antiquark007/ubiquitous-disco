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

interface QuizCompletionData {
  quizId: number;
  timeTaken: number;
  correctAnswers: number;
  totalQuestions: number;
}

interface AssessmentResponse {
  responses: {
    question: string;
    answer: string;
  }[];
}

interface UserResponse {
  optionId: string;
  isCorrect: boolean;
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
  const [userResponses, setUserResponses] = useState<Record<number, UserResponse>>({});
  const [startTime, setStartTime] = useState<number>(0);

  const isAssessment = id === '4' || id === '5';
  const isRegularQuiz = id === '1' || id === '2' || id === '3';

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dylexiaai.onrender.com/quiz/${id}`, {
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
        setStartTime(Date.now());
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
      handleQuizCompletion(true);
    }
  }, [timeLeft, quizData]);

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption || answeredQuestions.has(currentQuestionIndex)) return;
    
    setSelectedOption(optionId);
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex));
    
    const currentQuestion = quizData?.question_list[currentQuestionIndex];
    if (currentQuestion) {
      const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
      const isCorrect = selectedOption?.isCorrect || false;
      
      setUserResponses(prev => ({
        ...prev,
        [currentQuestionIndex]: { optionId, isCorrect }
      }));

      if (isCorrect) {
        setScore(prev => prev + 1);
      }
    }
    
    setShowExplanation(true);
  };

  const handleQuizCompletion = async (timeUp: boolean = false) => {
    if (!quizData || !isRegularQuiz) return;

    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Convert to seconds
    const userId = localStorage.getItem('user_id') || '';

    if (isAssessment) {
      // Create simplified assessment response body
      const assessmentResponse: AssessmentResponse = {
        responses: Object.entries(userResponses).map(([questionIndex, response]) => ({
          question: quizData.question_list[parseInt(questionIndex)].text,
          answer: response.optionId
        }))
      };

      console.log('Assessment Submission Request Body:', JSON.stringify(assessmentResponse, null, 2));
      console.log('Request URL:', `https://dylexiaai.onrender.com/assessment/submit?user_id=${userId}`);
      console.log('Request Method:', 'POST');
      console.log('Request Headers:', {
        'Content-Type': 'application/json'
      });

      try {
        const response = await fetch(`https://dylexiaai.onrender.com/assessment/submit?user_id=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(assessmentResponse)
        });

        if (!response.ok) {
          throw new Error('Failed to submit assessment results');
        }

        const result = await response.json();
        console.log('Assessment Analysis Result:', result);

        navigate('/quiz-completed', {
          state: {
            score: 0,
            totalQuestions: quizData.question_list.length,
            quizTitle: quizData.title,
            timeUp: false,
            isAssessment: true,
            timeTaken,
            correctAnswers: 0,
            assessmentResult: result
          }
        });
      } catch (error) {
        console.error('Error submitting assessment:', error);
        navigate('/quiz-completed', {
          state: {
            score: 0,
            totalQuestions: quizData.question_list.length,
            quizTitle: quizData.title,
            timeUp: false,
            isAssessment: true,
            timeTaken,
            correctAnswers: 0,
            submissionError: true
          }
        });
      }
    } else {
      // Regular quiz completion logic
      const completionData: QuizCompletionData = {
        quizId: quizData.id,
        timeTaken,
        correctAnswers: score,
        totalQuestions: quizData.question_list.length
      };

      console.log('Quiz Submission Request Body:', JSON.stringify(completionData, null, 2));
      console.log('Request URL:', `https://dylexiaai.onrender.com/quiz/submit?user_id=${userId}`);
      console.log('Request Method:', 'POST');
      console.log('Request Headers:', {
        'Content-Type': 'application/json'
      });

      try {
        const response = await fetch(`https://dylexiaai.onrender.com/quiz/submit?user_id=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(completionData)
        });

        if (!response.ok) {
          throw new Error('Failed to submit quiz results');
        }

        navigate('/quiz-completed', {
          state: {
            score,
            totalQuestions: quizData.question_list.length,
            quizTitle: quizData.title,
            timeUp: false,
            isAssessment: false,
            timeTaken,
            correctAnswers: score
          }
        });
      } catch (error) {
        console.error('Error submitting quiz results:', error);
        navigate('/quiz-completed', {
          state: {
            score,
            totalQuestions: quizData.question_list.length,
            quizTitle: quizData.title,
            timeUp: false,
            isAssessment: false,
            timeTaken,
            correctAnswers: score,
            submissionError: true
          }
        });
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quizData?.question_list.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      handleQuizCompletion();
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