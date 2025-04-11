import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Circular Disk Pointer */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-red-300 via-red-500 to-red-700 opacity-20 blur-[300px] transition-transform duration-75"
        style={{
          transform: `translate(${cursorPosition.x - 300}px, ${cursorPosition.y - 300}px)`,
        }}
      />

      <motion.div
        className="w-full max-w-xl bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 p-8 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            delay: 0.2
          }}
          className="mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <AlertTriangle size={50} className="text-red-500" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
        >
          Oops! An Error Has Occurred
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-xl text-gray-300 mb-8"
        >
          The page you're looking for is temporarily unavailable
        </motion.h2>

        <motion.div
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className="text-gray-400">
            We're working to fix this issue as quickly as possible. 
            Please try again later or return to the home page.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Home</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-40 h-40 bg-red-500/10 rounded-full blur-xl"
          animate={{
            x: [0, 10, -10, 0],
            y: [0, -10, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-red-700/10 rounded-full blur-xl"
          animate={{
            x: [0, -15, 15, 0],
            y: [0, 15, -15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default Error;