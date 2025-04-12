import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorCode] = useState(Math.floor(Math.random() * 3)); // Random error type

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const errorMessages = [
    {
      title: "Connection Error",
      description: "We're having trouble connecting to our servers. This might be due to network issues."
    },
    {
      title: "Oops! Page Not Found",
      description: "The resource you're looking for might have been moved or doesn't exist anymore."
    },
    {
      title: "Server Error",
      description: "We're experiencing some technical difficulties. Our team has been notified."
    }
  ];

  const currentError = errorMessages[errorCode];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Circular Disk Pointer with improved animation */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-red-300 via-red-500 to-red-700 opacity-20 blur-[300px] transition-transform duration-100"
        style={{
          transform: `translate(${cursorPosition.x - 300}px, ${cursorPosition.y - 300}px)`,
        }}
      />

      {/* Animated glitch effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-transparent via-red-900/5 to-transparent opacity-0"
        animate={{ 
          opacity: [0, 0.2, 0],
          height: ['0%', '100%', '0%'] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut", 
          times: [0, 0.5, 1] 
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key="error-card"
          className="w-full max-w-xl bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 p-8 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative mx-auto w-28 h-28 bg-red-500/20 rounded-full flex items-center justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              delay: 0.2
            }}
          >
            <motion.div 
              className="absolute inset-0 rounded-full bg-red-500/10" 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
            <AlertTriangle size={54} className="text-red-500" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                {currentError.title}
              </h1>
              
              {/* Subtle glitch effect */}
              <motion.div
                className="absolute inset-0 bg-red-500/10 mix-blend-overlay"
                animate={{
                  opacity: [0, 0.1, 0],
                  x: [0, -3, 3, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.5,
                  repeatDelay: 5,
                }}
              />
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl text-gray-300 mb-8"
          >
            {currentError.description}
          </motion.h2>

          <motion.div
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {/* Error code display */}
            <div className="inline-block px-4 py-1 rounded-full bg-red-900/30 border border-red-700/40 text-red-300 text-sm font-mono">
              Error ID: {Math.random().toString(36).substring(2, 8).toUpperCase()}
            </div>
            
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
                <Home className="w-5 h-5" />
                <span>Return to Home</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                disabled={isRetrying}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <motion.div
                  animate={isRetrying ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.div>
                <span>{isRetrying ? "Retrying..." : "Try Again"}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-700/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut"
          }}
        />
        
        {/* Additional floating elements */}
        <motion.div
          className="absolute top-2/3 left-1/3 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut"
          }}
        />
        
        {/* Diagonal lines */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="absolute h-px bg-gradient-to-r from-transparent via-red-500 to-transparent w-full"
              style={{ 
                top: `${i * 10}%`,
                transform: `rotate(${Math.random() * 5 - 2.5}deg)`,
                opacity: Math.random() * 0.5 + 0.5
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Error;