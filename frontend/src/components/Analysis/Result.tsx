import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertCircle, CheckCircle2, XCircle, RotateCcw, BarChart2, Activity, Target, Download, Share, ChevronRight } from 'lucide-react';

interface AnalysisProgress {
  stage: string;
  message: string;
  percent: number;
}

interface AnalysisResults {
  dyslexia_likelihood_percentage: number;
  risk_level: string;
  confidence_percentage: number;
  indicators?: string[];
  reading_profile: {
    strengths: string[];
    challenges: string[];
  };
  visualization_url?: string;
}

interface ResultsProps {
  results: AnalysisResults | null;
  loading: boolean;
  error: string | null;
  onReset: () => void;
  analysisProgress: AnalysisProgress;
}

const Results: React.FC<ResultsProps> = ({ results, loading, error, onReset, analysisProgress }) => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (results) {
      const timer = setTimeout(() => setShowDetails(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [results]);

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskLevelBg = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-500/10';
      case 'medium':
        return 'bg-yellow-500/10';
      case 'high':
        return 'bg-red-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-6 p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50"
      >
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-green-400 blur-lg opacity-20" />
            <Brain className="w-16 h-16 text-green-400 relative z-10" />
          </motion.div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white">{analysisProgress.stage}</h3>
          <p className="text-gray-400 text-lg">{analysisProgress.message}</p>
        </div>
        <div className="w-full max-w-md mx-auto bg-gray-700/30 rounded-full h-3 p-0.5">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${analysisProgress.percent}%` }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -right-1 -top-1 w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-red-500/20"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400 blur-lg opacity-20" />
            <AlertCircle className="w-16 h-16 text-red-400 relative z-10" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white">Analysis Error</h3>
          <p className="text-gray-400 text-lg">{error}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="flex items-center space-x-2 mx-auto px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Try Again</span>
        </motion.button>
      </motion.div>
    );
  }

  if (!results) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 via-black/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600" />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete</h2>
          <p className="text-gray-400">Detailed assessment of reading patterns and indicators</p>
        </div>
      </motion.div>

      {/* Risk Level and Likelihood Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-8 rounded-2xl ${getRiskLevelBg(results.risk_level)} border border-gray-700/50 backdrop-blur-lg relative overflow-hidden group hover:border-green-500/30 transition-colors`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <Target className={`w-8 h-8 ${getRiskLevelColor(results.risk_level)}`} />
              <h3 className="text-xl font-bold text-white">Risk Level Assessment</h3>
            </div>
            <div className="space-y-4">
              <div className={`text-4xl font-bold ${getRiskLevelColor(results.risk_level)}`}>
                {results.risk_level}
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="text-lg">Confidence:</div>
                <div className="flex-1 h-2 bg-gray-700/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${results.confidence_percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                  />
                </div>
                <div className="text-lg font-semibold text-green-400">
                  {results.confidence_percentage.toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-lg relative overflow-hidden group hover:border-green-500/30 transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart2 className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-bold text-white">Dyslexia Likelihood</h3>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-green-400">
                {results.dyslexia_likelihood_percentage.toFixed(0)}%
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-700/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${results.dyslexia_likelihood_percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                  />
                </div>
              </div>
              <p className="text-gray-400">Based on comprehensive reading pattern analysis</p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <>
            {/* Indicators Section */}
            {results.indicators && results.indicators.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-lg"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Activity className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Key Indicators</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.indicators.map((indicator, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-4 bg-gray-700/30 p-4 rounded-xl"
                    >
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">{indicator}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reading Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-lg"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Strengths</h3>
                </div>
                <div className="space-y-4">
                  {results.reading_profile.strengths.map((strength, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-4 bg-gray-700/30 p-4 rounded-xl"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">{strength}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-lg"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <XCircle className="w-8 h-8 text-red-400" />
                  <h3 className="text-xl font-bold text-white">Challenges</h3>
                </div>
                <div className="space-y-4">
                  {results.reading_profile.challenges.map((challenge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-4 bg-gray-700/30 p-4 rounded-xl"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">{challenge}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Results;