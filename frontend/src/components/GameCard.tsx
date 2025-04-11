import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

export function GameCard({ title, description, path, icon }: GameCardProps) {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = React.useState(false);

  const handleCardClick = () => {
    navigate(path);
  };

  const handleCardHover = () => {
    setIsHovering(true);
    // Accessibility: Speak the game title and description
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800/50 via-black/50 to-gray-900/50 backdrop-blur-lg rounded-xl border border-green-500/10 shadow-2xl h-full flex flex-col overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={handleCardHover}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{
        boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)",
        borderColor: "rgba(16, 185, 129, 0.3)"
      }}
    >
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center mb-4">
          <motion.div 
            className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mr-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {icon}
          </motion.div>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        
        <p className="text-gray-300 mb-4 flex-grow">
          {description}
        </p>
        
        <motion.div 
          className="mt-4 pt-4 border-t border-green-500/10"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-400/70">Start playing</span>
            <motion.div 
              className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"
              whileHover={{ scale: 1.2, backgroundColor: "rgba(16, 185, 129, 0.3)" }}
            >
              <ArrowRight size={16} className="text-green-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Hover gradient bar at the bottom */}
      <motion.div
        className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"
        initial={{ width: "0%" }}
        animate={{ width: isHovering ? "100%" : "0%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}