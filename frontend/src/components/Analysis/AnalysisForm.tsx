import React from 'react';

interface AnalysisFormProps {
  onStart: (isSimulation: boolean) => void;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onStart }) => {
  return (
    <div className="analysis-form">
      <h2>Welcome to Dyslexia Analysis System</h2>
      <p>
        This system analyzes facial expressions, audio reading, and eye movements
        to identify potential indicators of dyslexia.
      </p>
      <p className="note">
        <strong>Note:</strong> This is a screening tool and not a medical diagnostic tool.
      </p>
      
      <div className="buttons">
        <button 
          className="button primary" 
          onClick={() => onStart(false)}
        >
          Start Real Analysis
        </button>
        <button 
          className="button secondary"
          onClick={() => onStart(true)}
        >
          Run Simulation
        </button>
      </div>
      
      <div className="requirements">
        <h3>System Requirements:</h3>
        <ul>
          <li>Webcam for facial expression and eye tracking analysis</li>
          <li>Microphone for audio recording</li>
          <li>Chrome or Firefox browser</li>
          <li>Good lighting conditions</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisForm;