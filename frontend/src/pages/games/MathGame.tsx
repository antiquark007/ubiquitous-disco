import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷';
  answer: number;
}

const generateQuestion = (): Question => {
  const operators = ['+', '-', '×', '÷'];
  const operator = operators[Math.floor(Math.random() * operators.length)] as '+' | '-' | '×' | '÷';
  
  let num1, num2, answer;
  
  switch (operator) {
    case '+':
      num1 = Math.floor(Math.random() * 100);
      num2 = Math.floor(Math.random() * 100);
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 100);
      num2 = Math.floor(Math.random() * num1);
      answer = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
      break;
    case '÷':
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = Math.floor(Math.random() * 12) + 1;
      num1 = num2 * answer;
      break;
  }
  
  return { num1, num2, operator, answer };
};

export const MathGame: React.FC = () => {
  const [question, setQuestion] = useState<Question>(generateQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setGameOver(true);
    }
  }, [timer, gameOver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userAnswerNum = parseFloat(userAnswer);
    
    if (userAnswerNum === question.answer) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback({ type: 'success', message: 'Correct! Well done!' });
      setQuestion(generateQuestion());
      setUserAnswer('');
    } else {
      setStreak(0);
      setFeedback({ type: 'error', message: 'Try again!' });
    }
  };

  const handleSkip = () => {
    setQuestion(generateQuestion());
    setUserAnswer('');
    setFeedback({ type: null, message: '' });
  };

  const restartGame = () => {
    setQuestion(generateQuestion());
    setUserAnswer('');
    setScore(0);
    setStreak(0);
    setTimer(30);
    setGameOver(false);
    setFeedback({ type: null, message: '' });
  };

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
            Math Challenge
          </h2>
          <p className="text-xl text-gray-400">
            Solve the math problems as quickly as you can!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-green-500/20"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <div className="text-xl text-gray-300">
                Score: <span className="text-green-400">{score}</span>
              </div>
              <div className="text-xl text-gray-300">
                Streak: <span className="text-green-400">{streak}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {timer}s
            </div>
          </div>

          {!gameOver ? (
            <>
              <motion.div
                key={question.num1}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-8"
              >
                <div className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                  {question.num1} {question.operator} {question.num2} = ?
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full p-4 bg-gray-900 border-2 border-green-500/30 rounded-lg text-white text-2xl text-center focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Your answer"
                    autoFocus
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-xl rounded-lg transition-all transform hover:scale-105"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white text-xl rounded-lg transition-all transform hover:scale-105"
                  >
                    Skip
                  </button>
                </div>
              </form>

              <AnimatePresence>
                {feedback.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-6 p-4 rounded-lg text-center ${
                      feedback.type === 'success'
                        ? 'bg-green-500/20 border border-green-500'
                        : 'bg-red-500/20 border border-red-500'
                    }`}
                  >
                    <p className="text-xl font-semibold">
                      {feedback.message}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold text-green-400 mb-4">
                Time's Up! ⏰
              </h3>
              <p className="text-xl text-gray-300 mb-6">
                Your final score: {score}
              </p>
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-xl rounded-lg transition-all transform hover:scale-105"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};