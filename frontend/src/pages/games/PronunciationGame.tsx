import React, { useState, useEffect, useRef } from 'react';
import { SpeakButton } from '../../components/SpeakButton';
import type { Word } from '../../types';
import { motion } from 'framer-motion';

interface PronunciationFeedback {
  accuracy: number;
  userSaid: string;
  expected: string;
}

const words: Word[] = [
  { 
    word: "cat", 
    pronunciation: "kat",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&h=300"
  },
  { 
    word: "dog", 
    pronunciation: "dawg",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&h=300"
  },
  { 
    word: "fish", 
    pronunciation: "fish",
    imageUrl: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=300&h=300"
  },
  { 
    word: "bird", 
    pronunciation: "burd",
    imageUrl: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=300&h=300"
  },
  { 
    word: "star", 
    pronunciation: "stahr",
    imageUrl: "https://images.unsplash.com/photo-1435224668334-0f82ec57b605?auto=format&fit=crop&w=300&h=300"
  }
];

export const PronunciationGame: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<Word>(words[0]);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognitionImpl = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionImpl) {
      recognitionRef.current = new SpeechRecognitionImpl();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const userSpeech = event.results[0][0].transcript.toLowerCase();
        const confidence = event.results[0][0].confidence;
        analyzePronunciation(userSpeech, confidence);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setFeedback(null);
      recognitionRef.current.start();
      
      // Stop listening after 2 seconds
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 2000);
    }
  };

  const analyzePronunciation = (userSpeech: string, confidence: number) => {
    const accuracy = calculateAccuracy(userSpeech, currentWord.word, confidence);
    
    setFeedback({
      accuracy,
      userSaid: userSpeech,
      expected: currentWord.pronunciation
    });

    if (accuracy >= 0.7) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        nextWord();
      }, 1500);
    }
  };

  const calculateAccuracy = (userSpeech: string, targetWord: string, confidence: number): number => {
    const normalizedUser = userSpeech.trim().toLowerCase();
    const normalizedTarget = targetWord.toLowerCase();
    
    // Calculate similarity using Levenshtein distance
    const distance = levenshteinDistance(normalizedUser, normalizedTarget);
    const maxLength = Math.max(normalizedUser.length, normalizedTarget.length);
    const similarityScore = 1 - (distance / maxLength);
    
    // Combine with confidence score
    return (similarityScore * 0.7 + confidence * 0.3);
  };

  const levenshteinDistance = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  };

  const nextWord = () => {
    const nextIndex = words.indexOf(currentWord) + 1;
    if (nextIndex < words.length) {
      setCurrentWord(words[nextIndex]);
      setFeedback(null);
    } else {
      // Game complete
      const message = `Wonderful job! You learned ${words.length} new words!`;
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
      setCurrentWord(words[0]);
      setFeedback(null);
    }
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
            Word Adventure
          </h2>
          <p className="text-xl text-gray-400">
            Practice pronouncing words and improve your speaking skills!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-green-500/20"
        >
          <div className="text-center mb-8">
            <div className="mb-6">
              <img 
                src={currentWord.imageUrl} 
                alt={currentWord.word}
                className="w-48 h-48 mx-auto rounded-lg shadow-lg border-2 border-green-500/30"
              />
            </div>
            <h3 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              {currentWord.word}
            </h3>
            <p className="text-2xl text-gray-300 mb-4">
              Say it like: <span className="text-green-400">"{currentWord.pronunciation}"</span>
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <SpeakButton text={currentWord.word} />
            </div>
            <button
              onClick={startListening}
              disabled={isListening}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-xl rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:transform-none"
            >
              {isListening ? 'Listening...' : 'I Can Say It! 🎤'}
            </button>
          </div>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-gray-900/50 rounded-lg p-6 border border-green-500/20"
            >
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-2">
                  {Math.round(feedback.accuracy * 100)}%
                </div>
                <div className="text-xl text-gray-300 mb-4">
                  {feedback.accuracy >= 0.7 ? "Great job! 🌟" : "Try again! 💪"}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-400">You said:</div>
                  <div className="text-white text-right">"{feedback.userSaid}"</div>
                  <div className="text-gray-400">Expected:</div>
                  <div className="text-white text-right">"{feedback.expected}"</div>
                </div>
              </div>
            </motion.div>
          )}

          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="mt-4 text-center text-2xl text-green-400"
            >
              🎉 Perfect! Moving to next word... 🎉
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};