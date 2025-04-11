import React, { useState, useRef, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale } from 'chart.js';
import { Doughnut, Bar, Line, Radar, PolarArea } from 'react-chartjs-2';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';
import { ThreeScene } from '../components/ThreeScene';
import { Sidebar } from '../components/Sidebar';
import { motion } from 'framer-motion';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Track mouse position for the glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const options: Option[] = [
    { value: 100, label: "Always (100%)" },
    { value: 75, label: "Often (75%)" },
    { value: 50, label: "Sometimes (50%)" },
    { value: 25, label: "Rarely (25%)" },
    { value: 0, label: "Never (0%)" }
  ];

  const handleResponseChange = (questionId: string, value: number) => {
    const newResponses = {
      ...responses,
      [questionId]: value
    };
    setResponses(newResponses);
    
    // Analyze results immediately after each response
    const analysisResult = analyzeResponses(newResponses);
    setResult(analysisResult);
    
    // Move to next question if not at the end
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If at last question, show results
      setStep('results');
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

  // const handleDownloadPDF = async () => {
  //   if (!resultsRef.current) return;

  //   try {
  //     // Create a temporary container for the PDF content
  //     const tempContainer = document.createElement('div');
  //     tempContainer.style.position = 'absolute';
  //     tempContainer.style.left = '-9999px';
  //     tempContainer.style.top = '-9999px';
  //     tempContainer.style.width = '800px';
  //     tempContainer.style.backgroundColor = '#ffffff';
  //     tempContainer.style.padding = '40px';
  //     document.body.appendChild(tempContainer);

  //     // Clone the results content
  //     const content = resultsRef.current.cloneNode(true) as HTMLElement;
  //     tempContainer.appendChild(content);

  //     // Remove the download and reset buttons from the cloned content
  //     const buttons = content.querySelectorAll('button');
  //     buttons.forEach(button => button.remove());

  //     // Update styles for PDF visibility
  //     const elements = content.querySelectorAll('*');
  //     elements.forEach(element => {
  //       const el = element as HTMLElement;
  //       // Update text colors
  //       if (el.style.color.includes('white') || el.style.color.includes('gray')) {
  //         el.style.color = '#000000';
  //       }
  //       // Update background colors
  //       if (el.style.backgroundColor.includes('black') || el.style.backgroundColor.includes('gray')) {
  //         el.style.backgroundColor = '#ffffff';
  //       }
  //       // Update border colors
  //       if (el.style.borderColor.includes('green')) {
  //         el.style.borderColor = '#10b981';
  //       }
  //     });

  //     // Wait for charts to render
  //     await new Promise(resolve => setTimeout(resolve, 1000));

  //     // Capture the content with higher quality settings
  //     const canvas = await html2canvas(tempContainer, {
  //       scale: 2,
  //       useCORS: true,
  //       logging: false,
  //       backgroundColor: '#ffffff',
  //       width: 800,
  //       height: content.scrollHeight,
  //       allowTaint: true,
  //       foreignObjectRendering: true,
  //       onclone: (clonedDoc) => {
  //         // Ensure charts are visible in the clone
  //         const charts = clonedDoc.querySelectorAll('canvas');
  //         charts.forEach(chart => {
  //           chart.style.opacity = '1';
  //           chart.style.visibility = 'visible';
  //         });
  //       }
  //     });

  //     // Clean up
  //     document.body.removeChild(tempContainer);

  //     // Create PDF with proper dimensions
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const imgWidth = 210;
  //     const pageHeight = 297;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     let heightLeft = imgHeight;
  //     let position = 0;

  //     // Add first page
  //     pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     // Add new pages if content is longer than one page
  //     while (heightLeft >= 0) {
  //       position = heightLeft - imgHeight;
  //       pdf.addPage();
  //       pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     // Save the PDF
  //     pdf.save('dyslexia-assessment-results.pdf');
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //   }
  // };

  const getChartData = () => {
    if (!result) return null;

    // Doughnut chart data for overall score
    const doughnutData = {
      labels: ['Score', 'Remaining'],
      datasets: [
        {
          data: [result.overall_score, 100 - result.overall_score],
          backgroundColor: ['#10b981', '#111827'],
          borderColor: ['#059669', '#111827'],
          borderWidth: 1,
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
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: '#059669',
          borderWidth: 1,
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

  const renderContent = () => {
    if (step === 'questions') {
      return (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              Dyslexia Assessment
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Please answer the following questions to assess your child's learning profile
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/50 via-black/50 to-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-green-500/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-300">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <div className="w-1/2 h-2 bg-black/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-800/50">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-white">
                {currentQuestion.text}
              </h2>
              
              <div className="grid gap-4">
                {options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ 
                      scale: 0.98,
                      backgroundColor: '#10b981',
                      color: 'black',
                      fontWeight: 600,
                      transition: { duration: 0.1 }
                    }}
                    className={`w-full p-4 text-left rounded-xl transition-all duration-500 ${
                      responses[currentQuestion.id] === option.value
                        ? 'bg-gradient-to-r from-green-500 to-green-700 text-black font-semibold shadow-lg shadow-green-700/20'
                        : responses[currentQuestion.id] !== undefined && currentQuestionIndex > questions.findIndex(q => q.id === currentQuestion.id)
                          ? option.value === responses[currentQuestion.id]
                            ? 'bg-gradient-to-r from-green-500/80 to-green-700/80 text-black font-semibold'
                            : 'bg-gray-800/90 text-gray-200 border border-gray-700/50'
                          : 'bg-gray-800/90 text-gray-200 border border-gray-700/50 hover:border-green-500/30 active:bg-green-500 active:text-black active:font-semibold'
                    }`}
                    onClick={() => handleResponseChange(currentQuestion.id, option.value)}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border border-green-500/20 rounded-xl text-gray-200 hover:bg-gray-800/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </motion.button>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div ref={resultsRef} className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
            Assessment Results
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Detailed analysis of your child's learning profile
          </p>
        </motion.div>

        {result && chartData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-gray-800/50 via-black/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-xl border border-green-500/10 shadow-2xl"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-4">
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
                  <p className="text-3xl font-bold text-green-400">
                    {result.overall_score}%
                  </p>
                  <p className="text-gray-400">
                    Severity Level: {result.severity_level}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-gray-800/50 via-black/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-xl border border-green-500/10 shadow-2xl"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-4">
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
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-gray-800/50 via-black/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-xl border border-green-500/10 shadow-2xl"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-4">
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-gray-800/50 via-black/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-xl border border-green-500/10 shadow-2xl"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-4">
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
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 via-black/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-xl border border-green-500/10 shadow-2xl"
            >
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-4">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-gradient-to-br from-gray-800/50 via-black/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-xl border border-green-500/10 shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                Recommendations
              </h2>
              <div className="grid gap-6">
                {Object.entries(result.recommendations).map(([category, recs]) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={category} 
                    className="bg-gradient-to-br from-gray-800/60 via-black/60 to-gray-900/60 p-6 rounded-xl border border-green-500/10 hover:border-green-500/30 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold text-white">
                          {category}
                        </h3>
                        <div className="ml-4 w-32 h-2 bg-black/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-800/50">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                            style={{ width: `${result.category_scores[category]}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-green-400 font-medium">
                        {result.category_scores[category]}%
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {recs.map((rec, index) => (
                        <div key={index} className="flex items-start p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-all duration-200 border border-green-500/5 hover:border-green-500/20">
                          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-3 mt-1 shadow-lg shadow-green-500/20">
                            <span className="text-black text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-gray-200 leading-relaxed">
                            {rec}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-green-500/10">
                      <div className="flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Based on {category} assessment</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-green-700/10 rounded-xl border border-green-500/20 backdrop-blur-lg shadow-xl">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-400">
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
            </motion.div>

            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-emerald-600 text-black rounded-xl font-semibold flex items-center shadow-lg shadow-green-700/20"
                onClick={handleReset}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start New Assessment
              </motion.button>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border border-green-500/30 hover:border-green-400 text-white rounded-xl transition-colors duration-300 flex items-center"
                onClick={handleDownloadPDF}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF Report
              </motion.button> */}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Circular Disk Pointer */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-20 blur-[300px] transition-transform duration-75"
        style={{
          transform: `translate(${cursorPosition.x - 300}px, ${cursorPosition.y - 300}px)`,
        }}
      />

      {/* Three.js Background */}
      <div className="absolute inset-0">
        <ThreeScene />
      </div>

      {/* Sidebar */}
      <div className="flex h-screen">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Parents;