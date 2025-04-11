import React, { useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale } from 'chart.js';
import { Doughnut, Bar, Line, Radar, PolarArea } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale);

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

interface Recommendations {
  [key: string]: string[];
}

interface AnalysisResult {
  overall_score: number;
  category_scores: CategoryScores;
  recommendations: Recommendations;
  severity_level: string;
}

const questions: Question[] = [
  {
    id: "q1",
    text: "Does your child have difficulty recognizing rhyming words?",
    category: "phonological_awareness"
  },
  {
    id: "q2",
    text: "Does your child struggle to break words into syllables?",
    category: "phonological_awareness"
  },
  {
    id: "q3",
    text: "Does your child have trouble identifying individual sounds in words?",
    category: "phonological_awareness"
  },
  {
    id: "q4",
    text: "Does your child frequently reverse letters or numbers?",
    category: "visual_processing"
  },
  {
    id: "q5",
    text: "Does your child have difficulty tracking text while reading?",
    category: "visual_processing"
  },
  {
    id: "q6",
    text: "Does your child complain of words appearing to move or blur?",
    category: "visual_processing"
  },
  {
    id: "q7",
    text: "Does your child read very slowly compared to peers?",
    category: "reading_fluency"
  },
  {
    id: "q8",
    text: "Does your child struggle with reading aloud?",
    category: "reading_fluency"
  },
  {
    id: "q9",
    text: "Does your child frequently pause or hesitate while reading?",
    category: "reading_fluency"
  },
  {
    id: "q10",
    text: "Does your child have trouble remembering multi-step instructions?",
    category: "working_memory"
  },
  {
    id: "q11",
    text: "Does your child struggle to recall information from memory?",
    category: "working_memory"
  },
  {
    id: "q12",
    text: "Does your child have difficulty organizing thoughts?",
    category: "working_memory"
  },
  {
    id: "q13",
    text: "Does your child have trouble understanding what they read?",
    category: "reading_comprehension"
  },
  {
    id: "q14",
    text: "Does your child struggle to answer questions about what they read?",
    category: "reading_comprehension"
  },
  {
    id: "q15",
    text: "Does your child have difficulty making inferences from text?",
    category: "reading_comprehension"
  },
  {
    id: "q16",
    text: "Does your child have difficulty spelling common words?",
    category: "spelling"
  },
  {
    id: "q17",
    text: "Does your child spell the same word differently in the same piece of writing?",
    category: "spelling"
  },
  {
    id: "q18",
    text: "Does your child have trouble remembering spelling rules?",
    category: "spelling"
  }
];

const categories: { [key: string]: string } = {
  phonological_awareness: "Phonological Awareness",
  visual_processing: "Visual Processing",
  reading_fluency: "Reading Fluency",
  working_memory: "Working Memory",
  reading_comprehension: "Reading Comprehension",
  spelling: "Spelling"
};

const analyzeResponses = (responses: { [key: string]: number }): AnalysisResult => {
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
  
  // Generate recommendations
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
      }
    }
    
    // If no significant issues, provide general encouragement
    if (recommendations[categoryName].length === 0) {
      recommendations[categoryName] = ["Continue supporting development in this area"];
    }
  });
  
  return {
    overall_score: parseFloat(overallScore.toFixed(2)),
    category_scores: categoryScores,
    recommendations,
    severity_level: severityLevel
  };
};

const Parents: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [step, setStep] = useState<'questions' | 'results'>('questions');
  const resultsRef = useRef<HTMLDivElement>(null);

  const options: Option[] = [
    { value: 100, label: "Always (100%)" },
    { value: 75, label: "Often (75%)" },
    { value: 50, label: "Sometimes (50%)" },
    { value: 25, label: "Rarely (25%)" },
    { value: 0, label: "Never (0%)" }
  ];

  const handleResponseChange = (questionId: string, value: number) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const analysisResult = analyzeResponses(responses);
      setResult(analysisResult);
      setStep('results');
    } catch (error) {
      console.error('Error analyzing results:', error);
    }
  };

  const handleReset = () => {
    setResponses({});
    setResult(null);
    setStep('questions');
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;

    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#000000',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('dyslexia-assessment-results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const getChartData = () => {
    if (!result) return null;

    // Doughnut chart data for overall score
    const doughnutData = {
      labels: ['Score', 'Remaining'],
      datasets: [
        {
          data: [result.overall_score, 100 - result.overall_score],
          backgroundColor: ['#10b981', '#111827'],
          borderWidth: 0,
        },
      ],
    };

    // Bar chart data for category scores
    const barData = {
      labels: Object.keys(result.category_scores).map(key => categories[key]),
      datasets: [
        {
          label: 'Category Scores',
          data: Object.values(result.category_scores),
          backgroundColor: '#10b981',
          borderRadius: 5,
        },
      ],
    };

    // Line chart data for severity trend
    const severityData = {
      labels: Object.keys(result.category_scores).map(key => categories[key]),
      datasets: [
        {
          label: 'Severity Level',
          data: Object.values(result.category_scores),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    // Radar chart data for category comparison
    const radarData = {
      labels: Object.keys(result.category_scores).map(key => categories[key]),
      datasets: [
        {
          label: 'Category Scores',
          data: Object.values(result.category_scores),
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: '#10b981',
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#10b981',
        },
      ],
    };

    // Polar area chart data
    const polarData = {
      labels: Object.keys(result.category_scores).map(key => categories[key]),
      datasets: [
        {
          data: Object.values(result.category_scores),
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(16, 185, 129, 0.4)',
            'rgba(16, 185, 129, 0.2)',
            'rgba(16, 185, 129, 0.1)',
            'rgba(16, 185, 129, 0.05)',
          ],
          borderColor: '#10b981',
        },
      ],
    };

    return { doughnutData, barData, severityData, radarData, polarData };
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {step === 'questions' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-emerald-400 mb-2">
                Dyslexia Assessment
              </h1>
              <p className="text-gray-400">
                Please answer the following questions to assess your child's learning profile
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-300">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <div className="w-1/2 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-gray-100">
                  {currentQuestion.text}
                </h2>
                
                <div className="grid gap-4">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                        responses[currentQuestion.id] === option.value
                          ? 'bg-emerald-500 text-white border border-emerald-400'
                          : 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 hover:border-emerald-400'
                      }`}
                      onClick={() => handleResponseChange(currentQuestion.id, option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  className="px-6 py-2 border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-800 hover:border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                
                {currentQuestionIndex === questions.length - 1 && (
                  <button
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 border border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    onClick={handleSubmit}
                    disabled={!responses[currentQuestion.id]}
                  >
                    Submit Assessment
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultsRef} className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-emerald-400 mb-2">
                Assessment Results
              </h1>
              <p className="text-gray-400">
                Detailed analysis of your child's learning profile
              </p>
            </div>

            {result && chartData && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4">
                      Overall Score
                    </h2>
                    <div className="w-48 h-48 mx-auto">
                      <Doughnut
                        data={chartData.doughnutData}
                        options={{
                          cutout: '70%',
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-3xl font-bold text-emerald-400">
                        {result.overall_score}%
                      </p>
                      <p className="text-gray-400">
                        Severity Level: {result.severity_level}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4">
                      Category Scores
                    </h2>
                    <div className="h-64">
                      <Bar
                        data={chartData.barData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              grid: {
                                color: '#111827',
                              },
                              ticks: {
                                color: '#9ca3af',
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: '#9ca3af',
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4">
                      Severity Trend
                    </h2>
                    <div className="h-64">
                      <Line
                        data={chartData.severityData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              grid: {
                                color: '#111827',
                              },
                              ticks: {
                                color: '#9ca3af',
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: '#9ca3af',
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4">
                      Category Comparison
                    </h2>
                    <div className="h-64">
                      <Radar
                        data={chartData.radarData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            r: {
                              beginAtZero: true,
                              max: 100,
                              grid: {
                                color: '#111827',
                              },
                              angleLines: {
                                color: '#111827',
                              },
                              pointLabels: {
                                color: '#9ca3af',
                              },
                              ticks: {
                                color: '#9ca3af',
                                backdropColor: 'transparent',
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
                  <h2 className="text-xl font-semibold text-gray-100 mb-4">
                    Category Distribution
                  </h2>
                  <div className="h-64">
                    <PolarArea
                      data={chartData.polarData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                              color: '#111827',
                            },
                            ticks: {
                              color: '#9ca3af',
                              backdropColor: 'transparent',
                            },
                          },
                        },
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              color: '#9ca3af',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
                  <h2 className="text-2xl font-bold text-emerald-400 mb-6">
                    Recommendations
                  </h2>
                  <div className="grid gap-6">
                    {Object.entries(result.recommendations).map(([category, recs]) => (
                      <div key={category} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-emerald-400 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-emerald-400">
                              {categories[category]}
                            </h3>
                            <div className="ml-4 w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{ width: `${result.category_scores[category]}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-emerald-400 font-medium">
                            {result.category_scores[category]}%
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          {recs.map((rec, index) => (
                            <div key={index} className="flex items-start p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200">
                              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-500 rounded-full mr-3 mt-1">
                                <span className="text-white text-sm font-bold">{index + 1}</span>
                              </div>
                              <p className="text-gray-200 leading-relaxed">
                                {rec}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center text-sm text-gray-400">
                            <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Based on {categories[category]} assessment</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center mb-4">
                      <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-emerald-400">
                        Next Steps
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-300">
                        These recommendations are based on your child's assessment results. Consider implementing them gradually and monitoring progress.
                      </p>
                      <p className="text-gray-300">
                        For more detailed guidance, consult with educational specialists or schedule a follow-up assessment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 border border-emerald-400 transition-all duration-200 flex items-center"
                    onClick={handleReset}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Start New Assessment
                  </button>
                  <button
                    className="px-8 py-3 bg-gray-800 text-emerald-400 rounded-lg hover:bg-gray-700 border border-emerald-400 transition-all duration-200 flex items-center"
                    onClick={handleDownloadPDF}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF Report
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Parents;