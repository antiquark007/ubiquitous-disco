import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WordPair {
  word: string;
  meaning: string;
  matched: boolean;
}

const wordPairs: WordPair[] = [
  { word: 'LEARN', meaning: 'To gain knowledge or skill', matched: false },
  { word: 'TEACH', meaning: 'To help someone learn', matched: false },
  { word: 'STUDY', meaning: 'To learn about a subject', matched: false },
  { word: 'READ', meaning: 'To look at and understand written words', matched: false },
  { word: 'WRITE', meaning: 'To create words on paper or screen', matched: false }
];

export const WordMatch: React.FC = () => {
  const [words, setWords] = useState<WordPair[]>(wordPairs);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const shuffleArray = (array: WordPair[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setWords(shuffleArray(wordPairs));
  }, []);

  const handleWordClick = (word: string) => {
    if (selectedWord === null) {
      setSelectedWord(word);
    } else if (selectedMeaning === null) {
      checkMatch(word, selectedWord);
    }
  };

  const handleMeaningClick = (meaning: string) => {
    if (selectedMeaning === null) {
      setSelectedMeaning(meaning);
    } else if (selectedWord === null) {
      checkMatch(selectedMeaning, meaning);
    }
  };

  const checkMatch = (word: string, meaning: string) => {
    const wordPair = words.find(w => w.word === word || w.meaning === meaning);
    if (wordPair && wordPair.word === word && wordPair.meaning === meaning) {
      const updatedWords = words.map(w => 
        w.word === word ? { ...w, matched: true } : w
      );
      setWords(updatedWords);
      setScore(score + 1);
      
      if (updatedWords.every(w => w.matched)) {
        setGameComplete(true);
      }
    }
    
    setSelectedWord(null);
    setSelectedMeaning(null);
  };

  const restartGame = () => {
    setWords(shuffleArray(wordPairs));
    setScore(0);
    setGameComplete(false);
    setSelectedWord(null);
    setSelectedMeaning(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
            Word Match
          </h2>
          <p className="text-xl text-gray-400">
            Match each word with its correct meaning!
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-green-500/20"
          >
            <h3 className="text-2xl font-bold text-green-400 mb-4">Words</h3>
            <div className="grid grid-cols-1 gap-4">
              {words.map((pair, index) => (
                <button
                  key={index}
                  onClick={() => !pair.matched && handleWordClick(pair.word)}
                  className={`p-4 text-xl text-center rounded-lg transition-all ${
                    pair.matched
                      ? 'bg-green-500/20 text-green-400'
                      : selectedWord === pair.word
                      ? 'bg-green-500/50 text-white'
                      : 'bg-gray-900/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  disabled={pair.matched}
                >
                  {pair.word}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-green-500/20"
          >
            <h3 className="text-2xl font-bold text-green-400 mb-4">Meanings</h3>
            <div className="grid grid-cols-1 gap-4">
              {shuffleArray(words).map((pair, index) => (
                <button
                  key={index}
                  onClick={() => !pair.matched && handleMeaningClick(pair.meaning)}
                  className={`p-4 text-xl text-center rounded-lg transition-all ${
                    pair.matched
                      ? 'bg-green-500/20 text-green-400'
                      : selectedMeaning === pair.meaning
                      ? 'bg-green-500/50 text-white'
                      : 'bg-gray-900/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  disabled={pair.matched}
                >
                  {pair.meaning}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <div className="text-2xl text-gray-300">
            Score: <span className="text-green-400">{score}</span> / {words.length}
          </div>
        </div>

        <AnimatePresence>
          {gameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <div className="bg-gray-800/90 rounded-xl p-8 text-center max-w-md">
                <h3 className="text-3xl font-bold text-green-400 mb-4">
                  Congratulations! 🎉
                </h3>
                <p className="text-xl text-gray-300 mb-6">
                  You matched all the words correctly!
                </p>
                <button
                  onClick={restartGame}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-xl rounded-lg transition-all transform hover:scale-105"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 