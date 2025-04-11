import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreativePrompt } from '../../types';

interface AnalysisResult {
  fluency: number;
  originality: number;
  elaboration: number;
  flexibility: number;
  overallScore: number;
  feedback: string;
}

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
  const [isRecording, setIsRecording] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const getNextPrompt = () => {
    const availablePrompts = prompts.filter(p => !usedPrompts.includes(p.id));
    if (availablePrompts.length === 0) {
      setUsedPrompts([]);
      return prompts[Math.floor(Math.random() * prompts.length)];
    }
    return availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
  };

  const handleHintClick = () => {
    if (!showHints) {
      setShowHints(true);
    }
  };

  const showNextHint = () => {
    if (currentHintIndex < currentPrompt.hints.length - 1) {
      const nextIndex = currentHintIndex + 1;
      setCurrentHintIndex(nextIndex);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await analyzeSpeech(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeSpeech = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    try {
      // Here you would typically send the audio to your backend for analysis
      // For now, we'll simulate the analysis with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated analysis result
      const result: AnalysisResult = {
        fluency: Math.floor(Math.random() * 100),
        originality: Math.floor(Math.random() * 100),
        elaboration: Math.floor(Math.random() * 100),
        flexibility: Math.floor(Math.random() * 100),
        overallScore: Math.floor(Math.random() * 100),
        feedback: "Your creative thinking skills show great potential! You demonstrated good fluency in expressing your ideas and showed originality in your approach. Keep practicing to improve your elaboration and flexibility."
      };
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error analyzing speech:', error);
      setIsAnalyzing(false);
    }
  };

  const nextPrompt = () => {
    setShowCelebration(true);
    
    setTimeout(() => {
      const nextPrompt = getNextPrompt();
      setCurrentPrompt(nextPrompt);
      setUsedPrompts([...usedPrompts, nextPrompt.id]);
      setShowHints(false);
      setCurrentHintIndex(0);
      setShowCelebration(false);
      setAnalysisResult(null);
    }, 2000);
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
            Imagination Adventure
          </h2>
          <p className="text-xl text-gray-400">
            Let your creativity flow and share your ideas!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-green-500/20"
        >
          <div className="text-center mb-8">
            <div className="mb-6 relative group">
              <img 
                src={currentPrompt.imageUrl} 
                alt="Creative prompt"
                className="w-64 h-64 mx-auto rounded-lg shadow-md object-cover transform transition-transform group-hover:scale-105"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-green-400">{currentPrompt.question}</h3>
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={handleHintClick}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-lg transition-all transform hover:scale-105"
              >
                Need Ideas? 💡
              </button>
            </div>
            
            {showHints && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="text-lg text-gray-300 mb-2 p-4 bg-gray-700/50 rounded-lg">
                  {currentPrompt.hints[currentHintIndex]}
                </div>
                {currentHintIndex < currentPrompt.hints.length - 1 && (
                  <button
                    onClick={showNextHint}
                    className="text-green-400 hover:text-green-300 underline"
                  >
                    Show me another idea ➡️
                  </button>
                )}
              </motion.div>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full py-4 text-xl rounded-lg transition-all transform hover:scale-105 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500'
              }`}
            >
              {isRecording ? 'Stop Recording' : 'Share Your Ideas 🎤'}
            </button>

            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="text-xl text-gray-300">Analyzing your response...</div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mt-2"></div>
              </motion.div>
            )}

            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-6 p-6 bg-gray-700/50 rounded-lg"
              >
                <h4 className="text-2xl font-bold text-green-400 mb-4">Analysis Results</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="text-gray-300">Fluency</div>
                    <div className="h-2 bg-gray-600 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${analysisResult.fluency}%` }}
                      ></div>
                    </div>
                    <div className="text-green-400">{analysisResult.fluency}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-gray-300">Originality</div>
                    <div className="h-2 bg-gray-600 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${analysisResult.originality}%` }}
                      ></div>
                    </div>
                    <div className="text-green-400">{analysisResult.originality}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-gray-300">Elaboration</div>
                    <div className="h-2 bg-gray-600 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${analysisResult.elaboration}%` }}
                      ></div>
                    </div>
                    <div className="text-green-400">{analysisResult.elaboration}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-gray-300">Flexibility</div>
                    <div className="h-2 bg-gray-600 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${analysisResult.flexibility}%` }}
                      ></div>
                    </div>
                    <div className="text-green-400">{analysisResult.flexibility}%</div>
                  </div>
                </div>
                <div className="text-gray-300">
                  <p className="font-semibold text-green-400 mb-2">Overall Score: {analysisResult.overallScore}%</p>
                  <p>{analysisResult.feedback}</p>
                </div>
              </motion.div>
            )}

            <button
              onClick={nextPrompt}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-xl rounded-lg transition-all transform hover:scale-105"
            >
              Next Prompt ➡️
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};