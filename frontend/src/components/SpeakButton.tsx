import React from 'react';
import { Volume2 } from 'lucide-react';

interface SpeakButtonProps {
  text: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({ text }) => {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
    >
      <Volume2 className="w-4 h-4 mr-2" />
      Speak
    </button>
  );
};