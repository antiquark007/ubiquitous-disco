import React, { useState, useEffect, useRef } from 'react';
import AnalysisForm from '../components/Analysis/AnalysisForm';
import ReadingTest from '../components/Analysis/ReadingTest';
import Results from '../components/Analysis/Result';

interface AnalysisProgress {
  stage: string;
  message: string;
  percent: number;
}

interface AnalysisResults {
  dyslexia_likelihood_percentage: number;
  risk_level: string;
  confidence_percentage: number;
  reading_profile: string;
}


interface WebSocketMessage {
  status: 'progress' | 'complete' | 'error';
  stage?: string;
  message?: string;
  percent?: number;
  report?: AnalysisResults;
}

const Analysis: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSimulation, setIsSimulation] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress>({
    stage: '',
    message: '',
    percent: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const startAnalysis = (simulate = false) => {
    setIsSimulation(simulate);
    setStep(2);
  };

  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const data: WebSocketMessage = JSON.parse(event.data);

      if (data.status === 'progress') {
        setAnalysisProgress({
          stage: data.stage ?? 'analyzing',
          message: data.message ?? 'Processing...',
          percent: data.percent ?? 0,
        });
      } else if (data.status === 'complete') {
        if (data.report) {
          setResults(data.report);
        }
        setLoading(false);
        wsRef.current?.close();
        wsRef.current = null;
      } else if (data.status === 'error') {
        setError(data.message || 'An error occurred during analysis');
        setLoading(false);
        wsRef.current?.close();
        wsRef.current = null;
      } else {
        console.warn('Unknown WebSocket message status:', data.status);
      }
    } catch {
      setError('Failed to parse WebSocket message');
      setLoading(false);
    }
  };

  const startTest = async () => {
    setStep(3);
    setLoading(true);
    setError(null);
    setAnalysisProgress({
      stage: 'initializing',
      message: 'Starting analysis...',
      percent: 0,
    });

    try {
      if (isSimulation) {
        const response = await fetch('http://localhost:8000/analyze/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
        setLoading(false);
      } else {
        // Real-time analysis via WebSocket
        if (wsRef.current) {
          wsRef.current.close();
        }

        const socket = new WebSocket('ws://localhost:8000/ws/analyze');
        wsRef.current = socket;

        socket.onopen = () => {
          socket.send(JSON.stringify({ command: 'start' }));
        };

        socket.onmessage = handleWebSocketMessage;

        socket.onerror = () => {
          setError('WebSocket connection error');
          setLoading(false);
          wsRef.current?.close();
          wsRef.current = null;
        };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setStep(1);
    setResults(null);
    setError(null);
    setAnalysisProgress({ stage: '', message: '', percent: 0 });

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dyslexia Analysis System</h1>
      </header>

      <main className="App-main">
        {step === 1 && <AnalysisForm onStart={startAnalysis} />}
        {step === 2 && <ReadingTest onStart={startTest} isSimulation={isSimulation} />}
        {step === 3 && (
          <Results
            results={results}
            loading={loading}
            error={error}
            onReset={resetAnalysis}
            analysisProgress={analysisProgress}
          />
        )}
      </main>

      <footer className="App-footer">
        <p>Dyslexia Analysis System © 2025</p>
      </footer>
    </div>
  );
};

export default Analysis;
