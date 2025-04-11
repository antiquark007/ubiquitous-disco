import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameCardProps } from '../types';

export function GameCard({ title, description, path, icon }: GameCardProps) {
  const navigate = useNavigate();
  const [, setIsHovering] = React.useState(false);

  const handleCardClick = () => {
    navigate(path);
  };

  const handleCardHover = () => {
    setIsHovering(true);
    //window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-gradient-to-br from-gray-800/50 via-black/50 to-gray-900/50 backdrop-blur-lg p-6 rounded-xl border border-green-500/10 shadow-2xl cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={handleCardHover}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3">{icon}</div>}
        <h2 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      <p className="text-gray-300">{description}</p>
      <div className="mt-4 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-emerald-600 text-black rounded-lg font-semibold text-sm shadow-lg shadow-green-700/20"
        >
          Play Now
        </motion.button>
      </div>
    </motion.div>
  );
}