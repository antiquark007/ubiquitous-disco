import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Activity,
  Target,
  Clock,
  Trophy,
  Sparkles,
  BarChart2,
  Shield,
  Zap,
  CheckCircle,
  Play,
  Pause,
  SkipForward,
  ArrowRight
} from 'lucide-react';

import AnalysisForm from '../components/Analysis/AnalysisForm';
import ReadingTest from '../components/Analysis/ReadingTest';
import Results from '../components/Analysis/Result';
import { ThreeScene } from '../components/ThreeScene';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Sidebar } from '../components/Sidebar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisProgress {
  stage: string;
  message: string;
  percent: number;
}

interface AnalysisResults {
  dyslexia_likelihood_percentage: number;
  risk_level: string;
  confidence_percentage: number;
  reading_profile: {
    strengths: string[];
    challenges: string[];
  };
}

interface WebSocketMessage {
  status: 'progress' | 'complete' | 'error';
  stage?: string;
  message?: string;
  percent?: number;
  report?: AnalysisResults;
}

function ProgressCard({ title, value, icon: Icon, color, trend }: { title: string; value: string; icon: any; color?: string; trend?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/10 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            {trend && <p className={`text-${color || 'green'}-400 text-sm mt-2 flex items-center`}>
              <Zap className="w-4 h-4 mr-1" />
              {trend}
            </p>}
          </div>
          <div className={`p-3 bg-${color || 'green'}-500/10 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 text-${color || 'green'}-400`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            index + 1 === currentStep 
              ? 'bg-green-500 text-black' 
              : index + 1 < currentStep 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-white/10 text-white/40'
          }`}>
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`h-1 w-12 ${
              index + 1 < currentStep ? 'bg-green-500' : 'bg-white/10'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function ResultsGraphs({ results }: { results: AnalysisResults | null }) {
  if (!results) return null;

  const lineData = {
    labels: ['Reading Speed', 'Comprehension', 'Accuracy'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [85, 78, 92],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: ['Strengths', 'Challenges'],
    datasets: [
      {
        label: 'Reading Profile',
        data: [results.reading_profile.strengths.length, results.reading_profile.challenges.length],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      },
    ],
  };

  const pieData = {
    labels: ['Dyslexia Likelihood', 'Confidence'],
    datasets: [
      {
        data: [results.dyslexia_likelihood_percentage, results.confidence_percentage],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)'],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/10">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Performance Trends</h3>
        <Line data={lineData} options={{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: 'white' }
            }
          },
          scales: {
            y: {
              ticks: { color: 'white' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
              ticks: { color: 'white' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
          }
        }} />
      </div>
      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/10">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Profile Analysis</h3>
        <Bar data={barData} options={{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: 'white' }
            }
          },
          scales: {
            y: {
              ticks: { color: 'white' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
              ticks: { color: 'white' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
          }
        }} />
      </div>
      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/10">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Assessment Results</h3>
        <Pie data={pieData} options={{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: 'white' }
            }
          }
        }} />
      </div>
    </div>
  );
}

const Analysis: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [isSimulation, setIsSimulation] = useState<boolean>(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress>({
    stage: '',
    message: '',
    percent: 0
  });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const startAnalysis = (simulate: boolean = false): void => {
    setIsSimulation(simulate);
    setStep(2);
  };

  const handleWebSocketMessage = (event: MessageEvent): void => {
    try {
      const data: WebSocketMessage = JSON.parse(event.data);
      
      switch (data.status) {
        case 'progress':
          setAnalysisProgress({
            stage: data.stage || 'analyzing',
            message: data.message || 'Processing...',
            percent: data.percent || 0
          });
          break;
        case 'complete':
          if (data.report) {
            setResults(data.report);
            setLoading(false);
            if (wsRef.current) {
              wsRef.current.close();
              wsRef.current = null;
            }
          }
          break;
        case 'error':
          setError(data.message || 'An error occurred during analysis');
          setLoading(false);
          if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
          }
          break;
        default:
          console.warn('Unknown WebSocket message status:', data.status);
      }
    } catch (err) {
      setError('Failed to parse WebSocket message');
      setLoading(false);
    }
  };

  const startTest = async (): Promise<void> => {
    setStep(3);
    setLoading(true);
    setError(null);
    setAnalysisProgress({
      stage: 'initializing',
      message: 'Starting analysis...',
      percent: 0
    });

    try {
      if (isSimulation) {
        const response = await fetch('https://7bj88b4v-8000.inc1.devtunnels.ms/analyze/simulate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
        setLoading(false);
      } else {
        if (wsRef.current) {
          wsRef.current.close();
        }
        
        wsRef.current = new WebSocket('ws://7bj88b4v-8000.inc1.devtunnels.ms/ws/analyze');
        
        wsRef.current.onopen = (): void => {
          if (wsRef.current) {
            wsRef.current.send(JSON.stringify({ command: 'start' }));
          }
        };
        
        wsRef.current.onmessage = handleWebSocketMessage;
        
        wsRef.current.onerror = (): void => {
          setError('WebSocket connection error');
          setLoading(false);
          if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
          }
        };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const resetAnalysis = (): void => {
    setStep(1);
    setResults(null);
    setError(null);
    setAnalysisProgress({
      stage: '',
      message: '',
      percent: 0
    });
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Circular Disk Pointer */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-15 blur-[200px] transition-transform duration-75"
        style={{
          transform: `translate(${cursorPosition.x - 300}px, ${cursorPosition.y - 300}px)`,
        }}
      ></div>

      {/* Three.js Background */}
      <div className="absolute inset-0">
        <ThreeScene />
      </div>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />      

      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    Dyslexia Analysis
                  </h1>
                  <p className="text-white/60 mt-2">Comprehensive assessment and analysis</p>
                </div>

                <StepIndicator currentStep={step} totalSteps={3} />

                <motion.div 
                  className="bg-black/50 backdrop-blur-lg rounded-xl p-8 border border-green-500/10 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    {step === 1 && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <ProgressCard
                            title="Accuracy"
                            value="98%"
                            icon={Target}
                            color="green"
                            trend="Industry Leading"
                          />
                          <ProgressCard
                            title="Average Time"
                            value="15 min"
                            icon={Clock}
                            color="green"
                            trend="Quick & Efficient"
                          />
                        </div>
                        <div className="text-center space-y-4">
                          <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-green-500 to-green-700 text-black px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 mx-auto"
                            onClick={() => startAnalysis(false)}
                          >
                            <Play className="w-5 h-5" />
                            <span>Start Real Assessment</span>
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>

                          {/* <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 mx-auto"
                            onClick={() => startAnalysis(true)}
                          >
                            <Play className="w-5 h-5" />
                            <span>Run Simulation</span>
                            <ArrowRight className="w-5 h-5" />
                          </motion.button> */}
                        </div>
                      </div>
                    )}
                    
                    {step === 2 && (
                      <ReadingTest onStart={startTest} isSimulation={isSimulation} />
                    )}
                    
                    {step === 3 && (
                      <div className="space-y-8">
                        <Results 
                          results={results} 
                          loading={loading}
                          error={error}
                          onReset={resetAnalysis}
                          analysisProgress={analysisProgress}
                        />
                        {results && <ResultsGraphs results={results} />}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Analysis;