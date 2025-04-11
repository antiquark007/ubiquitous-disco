import React, { useState, useEffect } from 'react';
import type { MathProblem } from '../../types';
import { SpeakButton } from '../../components/SpeakButton';

const generateProblem = (): MathProblem => {
  const num1 = Math.floor(Math.random() * 5) + 1;
  const num2 = Math.floor(Math.random() * 5) + 1;
  const answer = num1 + num2;
  const options = [
    answer,
    answer + 1,
    answer - 1,
    answer + 2
  ].sort(() => Math.random() - 0.5);

  return {
    question: `${num1} + ${num2} = ?`,
    answer,
    options
  };
};

export const MathGame: React.FC = () => {
  const [problem, setProblem] = useState<MathProblem>(generateProblem());
  const [score, setScore] = useState(0);
  const [showStars, setShowStars] = useState(false);

  const handleAnswer = (selectedAnswer: number) => {
    const isCorrect = selectedAnswer === problem.answer;
    
    if (isCorrect) {
      const message = `Fantastic! ${problem.question.replace('=', 'equals')} ${selectedAnswer}`;
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
      setScore(score + 1);
      setShowStars(true);
      
      setTimeout(() => {
        setShowStars(false);
        setProblem(generateProblem());
      }, 1500);
    } else {
      const message = "Let's try again! You can do it!";
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-8">Number Fun</h2>
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="text-2xl mb-4">Score: {score} ⭐</div>
          <h3 className="text-6xl font-bold mb-4 text-indigo-600">{problem.question}</h3>
          <SpeakButton text={`What is ${problem.question}`} />
        </div>
        <div className="grid grid-cols-2 gap-6">
          {problem.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="py-6 px-8 bg-indigo-500 text-white text-4xl rounded-xl hover:bg-indigo-600 transition-colors shadow-md hover:shadow-lg"
            >
              {option}
            </button>
          ))}
        </div>
        {showStars && (
          <div className="mt-6 text-center text-4xl animate-bounce">
            🌟 Amazing! 🌟
          </div>
        )}
      </div>
    </div>
  );
};