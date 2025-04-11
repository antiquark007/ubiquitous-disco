import React from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertCircle, CheckCircle2, XCircle, RotateCcw, BarChart2, Activity, Target } from 'lucide-react';

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
        className="text-center space-y-6"
      >
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-12 h-12 text-green-400" />
          </motion.div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{analysisProgress.stage}</h3>
          <p className="text-gray-400">{analysisProgress.message}</p>
        </div>
        <div className="w-full max-w-md mx-auto bg-gray-700/30 rounded-full h-2.5">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${analysisProgress.percent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="flex justify-center">
          <AlertCircle className="w-12 h-12 text-red-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Analysis Error</h3>
          <p className="text-gray-400">{error}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
      {/* Risk Level Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl ${getRiskLevelBg(results.risk_level)} border border-gray-700/50`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Target className={`w-6 h-6 ${getRiskLevelColor(results.risk_level)}`} />
            <h3 className="text-lg font-semibold text-white">Risk Level</h3>
          </div>
          <div className="space-y-2">
            <div className={`text-3xl font-bold ${getRiskLevelColor(results.risk_level)}`}>
              {results.risk_level}
            </div>
            <div className="text-gray-400">
              Confidence: {results.confidence_percentage.toFixed(2)}%
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-gray-700/30 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3 mb-4">
            <BarChart2 className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Dyslexia Likelihood</h3>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-400">
              {results.dyslexia_likelihood_percentage.toFixed(2)}%
            </div>
            <div className="text-gray-400">
              Based on reading pattern analysis
            </div>
          </div>
        </motion.div>
      </div>

      {/* Indicators Section */}
      {results.indicators && results.indicators.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-gray-700/30 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Key Indicators</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.indicators.map((indicator, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                <span className="text-gray-300">{indicator}</span>
              </div>
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
          className="p-6 rounded-xl bg-gray-700/30 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Strengths</h3>
          </div>
          <div className="space-y-3">
            {results.reading_profile.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                <span className="text-gray-300">{strength}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-xl bg-gray-700/30 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3 mb-4">
            <XCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Challenges</h3>
          </div>
          <div className="space-y-3">
            {results.reading_profile.challenges.map((challenge, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                <span className="text-gray-300">{challenge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center space-x-4 pt-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Start New Analysis</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Results;