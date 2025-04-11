import React, { useState } from 'react';

// Define types
interface Question {
  id: string;
  text: string;
  category: string;
}

interface Option {
  value: number;
  label: string;
}

interface CategoryScores {
  [key: string]: number;
}

interface ChildInfo {
  name: string;
  age: number;
}

interface Recommendations {
  [key: string]: string[];
}

interface AnalysisResult {
  overall_score: number;
  category_scores: CategoryScores;
  recommendations: Recommendations;
  severity_level: string;
  child_info: ChildInfo;
}

const Parents: React.FC = () => {
  // State for child information
  const [childName, setChildName] = useState<string>('');
  const [childAge, setChildAge] = useState<number | ''>('');
  
  // State for responses
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  
  // State for results
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // State for form progress
  const [step, setStep] = useState<'info' | 'questions' | 'results'>('info');
  
  // Questions data (hardcoded to avoid API call for this example)
  const questions: Question[] = [
    {
      id: "q1",
      text: "Does your child have difficulty sounding out new words?",
      category: "phonological_awareness"
    },
    {
      id: "q2",
      text: "Does your child confuse letters that look similar (like b/d, p/q)?",
      category: "visual_processing"
    },
    {
      id: "q3",
      text: "Does your child struggle to blend sounds into words?",
      category: "phonological_awareness"
    },
    {
      id: "q4",
      text: "Does your child read very slowly compared to peers?",
      category: "reading_fluency"
    },
    {
      id: "q5",
      text: "Does your child have difficulty remembering sequences (like days of the week, months)?",
      category: "working_memory"
    },
    {
      id: "q6",
      text: "Does your child struggle with spelling, even common words?",
      category: "spelling"
    },
    {
      id: "q7",
      text: "Does your child have trouble following multi-step instructions?",
      category: "working_memory"
    },
    {
      id: "q8",
      text: "Does your child skip words or lines when reading?",
      category: "visual_processing"
    },
    {
      id: "q9",
      text: "Does your child have difficulty identifying rhyming words?",
      category: "phonological_awareness"
    },
    {
      id: "q10",
      text: "Does your child struggle with handwriting or writing in a straight line?",
      category: "visual_processing"
    },
    {
      id: "q11",
      text: "Does your child have difficulty understanding what they've read?",
      category: "reading_comprehension"
    },
    {
      id: "q12",
      text: "Does your child mix up the order of letters in words when writing?",
      category: "spelling"
    },
    {
      id: "q13",
      text: "Does your child avoid reading activities?",
      category: "reading_fluency"
    },
    {
      id: "q14",
      text: "Does your child have trouble expressing thoughts clearly in writing?",
      category: "reading_comprehension"
    },
    {
      id: "q15",
      text: "Does your child struggle with quick word recognition?",
      category: "reading_fluency"
    },
    {
      id: "q16",
      text: "Does your child have trouble learning new vocabulary?",
      category: "reading_comprehension"
    },
    {
      id: "q17",
      text: "Does your child find it difficult to break words into syllables?",
      category: "phonological_awareness"
    },
    {
      id: "q18",
      text: "Does your child show good comprehension when material is read to them, compared to when they read themselves?",
      category: "reading_comprehension"
    },
    {
      id: "q19",
      text: "Does your child confuse similar-sounding words (e.g., 'specific' and 'Pacific')?",
      category: "working_memory"
    },
    {
      id: "q20",
      text: "Does your child have difficulty with writing tasks compared to other academic areas?",
      category: "spelling"
    }
  ];
  
  const options: Option[] = [
    { value: 100, label: "Always (100%)" },
    { value: 75, label: "Often (75%)" },
    { value: 50, label: "Sometimes (50%)" },
    { value: 25, label: "Rarely (25%)" },
    { value: 0, label: "Never (0%)" }
  ];
  
  const categories: { [key: string]: string } = {
    "phonological_awareness": "Phonological Awareness",
    "visual_processing": "Visual Processing Skills",
    "reading_fluency": "Reading Fluency",
    "working_memory": "Working Memory",
    "reading_comprehension": "Reading Comprehension",
    "spelling": "Spelling & Writing"
  };

  // Submit child information and move to questions
  const handleChildInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (childName && childAge !== '') {
      setStep('questions');
    }
  };

  // Handle response change
  const handleResponseChange = (questionId: string, value: number) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  // Submit assessment for analysis
  const handleSubmit = async () => {
    try {
      // In a real application, you would call your API here
      // For this example, we'll simulate the analysis using the provided analysis function
      
      // This would typically be an API call:
      // const response = await axios.post('/api/analyze', {
      //   child_name: childName,
      //   child_age: childAge,
      //   responses
      // });
      // setResult(response.data);
      
      // For this demo, we'll simulate the results with a simplified version of the analysis
      const simpleAnalysis = analyzeResponses(childName, Number(childAge), responses);
      setResult(simpleAnalysis);
      setStep('results');
    } catch (error) {
      console.error('Error analyzing results:', error);
      alert('An error occurred while analyzing the results. Please try again.');
    }
  };

  // Simple simulation of analysis function (simplified version of the provided Python function)
  const analyzeResponses = (
    name: string,
    age: number,
    responses: { [key: string]: number }
  ): AnalysisResult => {
    // Calculate category scores
    const categoryScores: CategoryScores = {};
    const categoryCounts: { [key: string]: number } = {};
    
    questions.forEach(question => {
      const category = question.category;
      const response = responses[question.id] || 0;
      
      if (!categoryScores[category]) {
        categoryScores[category] = 0;
        categoryCounts[category] = 0;
      }
      
      categoryScores[category] += response;
      categoryCounts[category]++;
    });
    
    // Calculate average scores for each category
    Object.keys(categoryScores).forEach(category => {
      categoryScores[category] = categoryScores[category] / (categoryCounts[category] || 1);
    });
    
    // Calculate overall score
    const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0);
    const overallScore = totalScore / (Object.keys(responses).length || 1);
    
    // Determine severity level
    let severityLevel = "Minimal or No Indicators";
    if (overallScore >= 80) {
      severityLevel = "Strong Indicators";
    } else if (overallScore >= 60) {
      severityLevel = "Significant Indicators";
    } else if (overallScore >= 40) {
      severityLevel = "Moderate Indicators";
    } else if (overallScore >= 20) {
      severityLevel = "Mild Indicators";
    }
    
    // Generate recommendations (simplified version)
    const recommendations: Recommendations = {};
    
    Object.entries(categoryScores).forEach(([category, score]) => {
      const categoryName = categories[category] || category;
      recommendations[categoryName] = [];
      
      if (score >= 50) {
        // Add high-score recommendations based on category
        switch (category) {
          case "phonological_awareness":
            recommendations[categoryName] = [
              "Practice breaking words into individual sounds (phonemes)",
              "Play rhyming games and focus on word families",
              "Use letter tiles or cards to build and segment words"
            ];
            break;
          case "visual_processing":
            recommendations[categoryName] = [
              "Use colored overlays when reading",
              "Try larger font sizes and increased spacing between lines",
              "Practice visual tracking exercises"
            ];
            break;
          case "reading_fluency":
            recommendations[categoryName] = [
              "Practice repeated reading of the same passages",
              "Try paired reading with a parent or tutor",
              "Use audiobooks alongside printed text"
            ];
            break;
          case "working_memory":
            recommendations[categoryName] = [
              "Break instructions into smaller steps",
              "Use memory games and activities daily",
              "Create visual checklists and reminders"
            ];
            break;
          case "reading_comprehension":
            recommendations[categoryName] = [
              "Pre-teach vocabulary before reading new material",
              "Use graphic organizers to map out story elements",
              "Practice visualization while reading"
            ];
            break;
          case "spelling":
            recommendations[categoryName] = [
              "Use multisensory spelling methods (see, say, cover, write, check)",
              "Focus on spelling patterns rather than memorization",
              "Try assistive technology like spell checkers or dictation software"
            ];
            break;
          default:
            recommendations[categoryName] = ["Seek professional assessment"];
        }
      } else if (score >= 25) {
        // Add medium-score recommendations
        switch (category) {
          case "phonological_awareness":
            recommendations[categoryName] = [
              "Read books with rhyming patterns",
              "Practice clapping syllables in words"
            ];
            break;
          case "visual_processing":
            recommendations[categoryName] = [
              "Reduce visual clutter in reading materials",
              "Practice visual discrimination activities"
            ];
            break;
          case "reading_fluency":
            recommendations[categoryName] = [
              "Read aloud daily for short periods",
              "Choose high-interest, lower-level texts"
            ];
            break;
          case "working_memory":
            recommendations[categoryName] = [
              "Use mnemonic devices for remembering sequences",
              "Practice recall activities with increasing complexity"
            ];
            break;
          case "reading_comprehension":
            recommendations[categoryName] = [
              "Discuss stories before and after reading",
              "Ask prediction questions while reading"
            ];
            break;
          case "spelling":
            recommendations[categoryName] = [
              "Create personalized spelling lists based on errors",
              "Use tactile methods like writing in sand or with textured materials"
            ];
            break;
          default:
            recommendations[categoryName] = ["Monitor progress in this area"];
        }
      }
      
      // If no significant issues, provide general encouragement
      if (recommendations[categoryName].length === 0) {
        recommendations[categoryName] = ["Continue supporting development in this area"];
      }
    });
    
    // Format category scores for display
    const formattedCategoryScores: CategoryScores = {};
    Object.entries(categoryScores).forEach(([category, score]) => {
      formattedCategoryScores[categories[category] || category] = parseFloat(score.toFixed(2));
    });
    
    return {
      overall_score: parseFloat(overallScore.toFixed(2)),
      category_scores: formattedCategoryScores,
      recommendations,
      severity_level: severityLevel,
      child_info: {
        name,
        age
      }
    };
  };

  // Reset the assessment
  const handleReset = () => {
    setChildName('');
    setChildAge('');
    setResponses({});
    setResult(null);
    setStep('info');
  };

  // Count answered questions
  const answeredCount = Object.keys(responses).length;
  const questionsComplete = answeredCount === questions.length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {step === 'info' && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Child Information</h2>
          <form onSubmit={handleChildInfoSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="childName">
                Child's Name:
              </label>
              <input
                type="text"
                id="childName"
                className="w-full p-2 border border-gray-300 rounded"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="childAge">
                Child's Age:
              </label>
              <input
                type="number"
                id="childAge"
                className="w-full p-2 border border-gray-300 rounded"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value === '' ? '' : Number(e.target.value))}
                min="3"
                max="18"
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Begin Assessment
            </button>
          </form>
        </div>
      )}
      
      {step === 'questions' && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">Dyslexia Assessment Questionnaire</h2>
            <p className="text-gray-600 mb-4">
              Please answer all questions based on your observations of {childName}.
              For each question, indicate how frequently you observe the described behavior.
            </p>
            
            <div className="mb-4 bg-blue-50 p-3 rounded">
              <p className="font-medium">Progress: {answeredCount} of {questions.length} questions answered</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <p className="mb-4">{question.text}</p>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                {options.map((option) => (
                  <label key={option.value} className="flex items-center mb-2 sm:mb-0">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={responses[question.id] === option.value}
                      onChange={() => handleResponseChange(question.id, option.value)}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep('info')}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Back
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={!questionsComplete}
              className={`py-2 px-4 rounded ${
                questionsComplete
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {questionsComplete 
                ? 'Generate Report' 
                : `Please Answer All Questions (${questions.length - answeredCount} remaining)`}
            </button>
          </div>
        </div>
      )}
      
      {step === 'results' && result && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">Assessment Results</h2>
            <p className="mb-4">
              Assessment for {result.child_info.name}, Age {result.child_info.age}
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Overall Result</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-lg font-medium">
                  Severity Level: <span className="font-bold">{result.severity_level}</span>
                </p>
                <p className="text-gray-700">
                  Overall Score: {result.overall_score}/100
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div 
                    className={`h-4 rounded-full ${
                      result.overall_score >= 80 ? 'bg-red-600' :
                      result.overall_score >= 60 ? 'bg-orange-500' :
                      result.overall_score >= 40 ? 'bg-yellow-500' :
                      result.overall_score >= 20 ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${result.overall_score}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Category Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.category_scores).map(([category, score]) => (
                  <div key={category} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{category}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            score >= 80 ? 'bg-red-600' :
                            score >= 60 ? 'bg-orange-500' :
                            score >= 40 ? 'bg-yellow-500' :
                            score >= 20 ? 'bg-blue-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
              {Object.entries(result.recommendations).map(([category, recs]) => (
                recs.length > 0 && (
                  <div key={category} className="mb-4">
                    <h4 className="font-medium text-lg">{category}</h4>
                    <ul className="list-disc pl-5 mt-2">
                      {recs.map((rec, index) => (
                        <li key={index} className="mb-1">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="font-medium text-blue-800">Important Note</p>
              <p className="text-blue-700 text-sm">
                This assessment is designed as a screening tool only and does not constitute a 
                professional diagnosis. If your child's results indicate moderate to strong 
                indicators of dyslexia, we recommend consulting with an educational psychologist 
                or dyslexia specialist for a comprehensive evaluation.
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleReset}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Start New Assessment
              </button>
              
              <button
                onClick={() => window.print()}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parents;