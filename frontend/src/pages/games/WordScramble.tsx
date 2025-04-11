import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Word {
  word: string;
  hint: string;
}

const words: Word[] = [
  { word: 'LEARNING', hint: 'The process of acquiring knowledge' },
  { word: 'EDUCATION', hint: 'The process of receiving or giving systematic instruction' },
  { word: 'KNOWLEDGE', hint: 'Facts, information, and skills acquired through experience or education' },
  { word: 'STUDENT', hint: 'A person who is studying at a school or college' },
  { word: 'TEACHER', hint: 'A person who helps others to acquire knowledge' }
];

export const WordScramble: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<Word>(words[0]);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const nextWord = () => {
    const currentIndex = words.indexOf(currentWord);
    const nextIndex = (currentIndex + 1) % words.length;
    const nextWord = words[nextIndex];
    setCurrentWord(nextWord);
    setScrambledWord(scrambleWord(nextWord.word));
    setUserInput('');
    setFeedback({ type: null, message: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === currentWord.word) {
      setScore(score + 1);
      setFeedback({ type: 'success', message: 'Correct! Well done!' });
      setTimeout(nextWord, 1500);
    } else {
      setFeedback({ type: 'error', message: 'Try again!' });
    }
  };

  React.useEffect(() => {
    setScrambledWord(scrambleWord(currentWord.word));
  }, [currentWord]);

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
            Word Scramble
          </h2>
          <p className="text-xl text-gray-400">
            Unscramble the letters to form the correct word!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-green-500/20"
        >
          <div className="text-center mb-8">
            <div className="text-2xl text-gray-300 mb-4">
              Score: <span className="text-green-400">{score}</span>
            </div>
            <div className="text-xl text-gray-400 mb-4">
              Hint: {currentWord.hint}
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              {scrambledWord}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                className="w-full p-4 bg-gray-900 border-2 border-green-500/30 rounded-lg text-white text-2xl text-center focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Type your answer"
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
                onClick={nextWord}
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
        </motion.div>
      </div>
    </div>
  );
}; 