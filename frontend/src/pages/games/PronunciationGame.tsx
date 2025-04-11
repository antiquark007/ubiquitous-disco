import React, { useState, useEffect, useRef } from 'react';
import { SpeakButton } from '../../components/SpeakButton';
import type { Word } from '../../types';

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
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-8">Word Adventure</h2>
      <div className="bg-dark rounded-xl p-8 shadow-lg border-green">
        <div className="text-center mb-8">
          <div className="mb-6">
            <img 
              src={currentWord.imageUrl} 
              alt={currentWord.word}
              className="w-48 h-48 mx-auto rounded-lg shadow-md"
            />
          </div>
          <h3 className="text-6xl font-bold mb-4 text-green">{currentWord.word}</h3>
          <p className="text-2xl text-gray-300 mb-4">Say it like: "{currentWord.pronunciation}"</p>
          <div className="flex justify-center gap-4 mb-6">
            <SpeakButton text={currentWord.word} />
          </div>
          <button
            onClick={startListening}
            disabled={isListening}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white text-xl rounded-lg transition-colors disabled:bg-gray-500"
          >
            {isListening ? 'Listening...' : 'I Can Say It! 🎤'}
          </button>
        </div>

        {feedback && (
          <div className="mt-4 bg-darker rounded-lg p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green mb-2">
                {Math.round(feedback.accuracy * 100)}%
              </div>
              <div className="text-xl text-gray-300 mb-4">
                {feedback.accuracy >= 0.7 ? "Great job! 🌟" : "Try again! 💪"}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-300">You said:</div>
                <div className="text-white text-right">"{feedback.userSaid}"</div>
                <div className="text-gray-300">Expected:</div>
                <div className="text-white text-right">"{feedback.expected}"</div>
              </div>
            </div>
          </div>
        )}

        {showCelebration && (
          <div className="mt-4 text-center text-2xl">
            🎉 Perfect! Moving to next word... 🎉
          </div>
        )}
      </div>
    </div>
  );
};