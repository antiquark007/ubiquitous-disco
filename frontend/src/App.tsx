import React, { useState, useEffect, useRef } from 'react';
import AnalysisForm from './components/AnalysisForm';
import ReadingTest from './components/ReadingTest';
import Results from './components/Results';
import './App.css';

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

const App: React.FC = () => {
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
  
  const wsRef = useRef<WebSocket | null>(null);

  // Clean up WebSocket when component unmounts
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const startAnalysis = (simulate: boolean = false): void => {
    setIsSimulation(simulate);
    setStep(2); // Move to reading test step
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
    setStep(3); // Move to testing/results step
    setLoading(true);
    setError(null);
    setAnalysisProgress({
      stage: 'initializing',
      message: 'Starting analysis...',
      percent: 0
    });

    try {
      if (isSimulation) {
        // Run simulated analysis
        const response = await fetch('http://localhost:8000/analyze/simulate', {
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
        // Connect to WebSocket for real analysis
        if (wsRef.current) {
          wsRef.current.close();
        }
        
        wsRef.current = new WebSocket('ws://localhost:8000/ws/analyze');
        
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
    <div className="App">
      <header className="App-header">
        <h1>Dyslexia Analysis System</h1>
      </header>
      
      <main className="App-main">
        {step === 1 && (
          <AnalysisForm onStart={startAnalysis} />
        )}
        
        {step === 2 && (
          <ReadingTest onStart={startTest} isSimulation={isSimulation} />
        )}
        
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

export default App;