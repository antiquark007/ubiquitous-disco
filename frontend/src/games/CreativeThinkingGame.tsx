import React, { useState, useEffect } from 'react';
import { SpeakButton } from '../components/SpeakButton';
import type { CreativePrompt } from '../types';

const prompts: CreativePrompt[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=500&h=500",
    question: "What do you think this rainbow-colored butterfly is dreaming about?",
    hints: ["Is it flying somewhere special?", "What colors make you happy?", "What would you do if you had wings?"]
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1578923931302-6f9b5a9c8e9b?auto=format&fit=crop&w=500&h=500",
    question: "Imagine you found this magical treehouse! What adventures would you have?",
    hints: ["Who would live there?", "What would you find inside?", "What games would you play?"]
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?auto=format&fit=crop&w=500&h=500",
    question: "If this friendly dragon was your pet, what would you name it?",
    hints: ["Where would it sleep?", "What would you feed it?", "Where would you fly together?"]
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&h=500",
    question: "You found a magical garden! What special things grow there?",
    hints: ["What colors are the flowers?", "Are there any magical creatures?", "What does it smell like?"]
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1525183995014-bd94c0750cd5?auto=format&fit=crop&w=500&h=500",
    question: "This cloud looks like it's made of cotton candy! What flavor would it be?",
    hints: ["What would happen if you took a bite?", "Where did it come from?", "Who else might want to taste it?"]
  }
];

const encouragements = [
  "What a fantastic idea! Tell me more!",
  "That's so creative! What happens next?",
  "I love how you're thinking! Can you add more details?",
  "Your imagination is amazing! What else do you see?",
  "That's a wonderful thought! How does it make you feel?"
];

export const CreativeThinkingGame: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState<CreativePrompt>(prompts[Math.floor(Math.random() * prompts.length)]);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [usedPrompts, setUsedPrompts] = useState<number[]>([]);

  const speakPrompt = (text: string) => {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const getRandomEncouragement = () => {
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };

  const getNextPrompt = () => {
    const availablePrompts = prompts.filter(p => !usedPrompts.includes(p.id));
    if (availablePrompts.length === 0) {
      setUsedPrompts([]); // Reset used prompts if all have been shown
      return prompts[Math.floor(Math.random() * prompts.length)];
    }
    return availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
  };

  const handleHintClick = () => {
    if (!showHints) {
      setShowHints(true);
      speakPrompt(currentPrompt.hints[0]);
    }
  };

  const showNextHint = () => {
    if (currentHintIndex < currentPrompt.hints.length - 1) {
      const nextIndex = currentHintIndex + 1;
      setCurrentHintIndex(nextIndex);
      speakPrompt(currentPrompt.hints[nextIndex]);
    }
  };

  const nextPrompt = () => {
    const encouragement = getRandomEncouragement();
    speakPrompt(encouragement);
    setShowCelebration(true);
    
    setTimeout(() => {
      const nextPrompt = getNextPrompt();
      setCurrentPrompt(nextPrompt);
      setUsedPrompts([...usedPrompts, nextPrompt.id]);
      setShowHints(false);
      setCurrentHintIndex(0);
      setShowCelebration(false);
    }, 2000);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      speakPrompt(currentPrompt.question);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [currentPrompt]);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-8">Imagination Adventure</h2>
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="mb-6 relative group">
            <img 
              src={currentPrompt.imageUrl} 
              alt="Creative prompt"
              className="w-64 h-64 mx-auto rounded-lg shadow-md object-cover transform transition-transform group-hover:scale-105"
            />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-indigo-600">{currentPrompt.question}</h3>
          <div className="flex justify-center gap-4 mb-6">
            <SpeakButton text={currentPrompt.question} />
            <button
              onClick={handleHintClick}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transform transition-transform hover:scale-105"
            >
              Need Ideas? 💡
            </button>
          </div>
          
          {showHints && (
            <div className="mb-6 animate-fade-in">
              <div className="text-lg text-gray-700 mb-2 p-4 bg-purple-50 rounded-lg">
                {currentPrompt.hints[currentHintIndex]}
              </div>
              {currentHintIndex < currentPrompt.hints.length - 1 && (
                <button
                  onClick={showNextHint}
                  className="text-sm text-purple-600 hover:text-purple-700 underline"
                >
                  Show me another idea ➡️
                </button>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={nextPrompt}
          className="w-full py-4 bg-green-500 text-white text-xl rounded-lg hover:bg-green-600 transition-all transform hover:scale-105"
        >
          I Shared My Ideas! 🌟
        </button>
        
        {showCelebration && (
          <div className="mt-6 text-center animate-bounce">
            <div className="text-4xl mb-2">✨ 🎨 🌟</div>
            <div className="text-2xl text-indigo-600 font-bold">
              {getRandomEncouragement()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};