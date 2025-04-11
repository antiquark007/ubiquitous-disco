import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mic, AlertCircle, ChevronRight } from 'lucide-react';

interface ReadingTestProps {
  onStart: () => void;
  isSimulation: boolean;
}

const ReadingTest: React.FC<ReadingTestProps> = ({ onStart, isSimulation }) => {
  const [permission, setPermission] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [testRunning, setTestRunning] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(20);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Request camera permission and display preview
  useEffect(() => {
    if (!isSimulation) {
      requestCameraPermission();
    }
    
    return () => {
      // Clean up when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isSimulation]);

  // Countdown timer effect
  useEffect(() => {
    if (testRunning && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (testRunning && remainingTime === 0) {
      setTestRunning(false);
      onStart();
    }
  }, [testRunning, remainingTime, onStart]);

  const requestCameraPermission = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      setPermission(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setPermission(false);
    }
  };

  const startReadingTest = (): void => {
    setCountdown(3);
    
    // Start countdown from 3
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          setTestRunning(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
          Reading Test
        </h2>
        
        {isSimulation ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-center space-x-2 text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <p><strong>SIMULATION MODE</strong></p>
            </div>
            <p className="text-yellow-400 mt-2">Running in simulation mode without camera or audio recording.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-400">Please ensure your webcam and microphone are enabled.</p>
            <p className="text-gray-400">Position yourself in good lighting with your face visible to the camera.</p>
            
            {!permission && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                onClick={requestCameraPermission}
              >
                <Camera className="w-5 h-5" />
                <span>Enable Camera</span>
              </motion.button>
            )}
          </div>
        )}
      </div>
      
      {/* Camera Preview */}
      {!isSimulation && permission && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-gray-700"
        >
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            muted
            className={`w-full h-full object-cover ${testRunning ? "ring-2 ring-green-500" : ""}`}
          />
          {testRunning && (
            <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
              Recording
            </div>
          )}
        </motion.div>
      )}
      
      {/* Countdown Overlay */}
      {countdown && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        >
          <div className="text-8xl font-bold text-white">{countdown}</div>
        </motion.div>
      )}
      
      {/* Test In Progress UI */}
      {testRunning && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block px-6 py-3 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{remainingTime}s</div>
            <div className="text-gray-400">Time Remaining</div>
          </div>
        </motion.div>
      )}
      
      {/* Reading Text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-2xl mx-auto p-6 bg-gray-700/30 rounded-lg border border-gray-700/50 ${testRunning ? 'ring-2 ring-green-500' : ''}`}
      >
        <h3 className="text-xl font-semibold mb-4">Please read the following text aloud:</h3>
        <div className="space-y-4 text-gray-300">
          <p>1. The quick brown fox jumps over the lazy dog.</p>
          <p>2. She sells seashells by the seashore.</p>
          <p>3. Peter Piper picked a peck of pickled peppers.</p>
        </div>
      </motion.div>
      
      {!testRunning && !countdown && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <p className="text-gray-400">
            When you're ready, click the button below to begin the test.
            The system will analyze your reading for about 20 seconds.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={startReadingTest}
            disabled={!isSimulation && !permission}
          >
            <span>I'm Ready - Start Analysis</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ReadingTest;