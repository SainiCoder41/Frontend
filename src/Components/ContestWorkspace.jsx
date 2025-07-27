import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { 
  SiCplusplus, SiJavascript, SiPython 
} from 'react-icons/si';
import { 
  FiClock, FiX, FiCode, FiList, 
  FiChevronLeft, FiChevronRight,
  FiAlertCircle, FiChevronDown, FiChevronUp,
  FiPlay, FiSend, FiCheck, FiAlertTriangle, FiSave,
  FiMaximize2, FiMinimize2
} from 'react-icons/fi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark-dimmed.css';
import axiosClient from '../utils/axiosClient';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import _ from 'lodash';

const ContestWorkspace = ({ problemIds, contest, onClose }) => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [codeByProblemAndLanguage, setCodeByProblemAndLanguage] = useState({});
  const [error, setError] = useState(null);
  const [activeProblem, setActiveProblem] = useState(0);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isProblemListCollapsed, setIsProblemListCollapsed] = useState(false);
  const [isTestCasesExpanded, setIsTestCasesExpanded] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('testCases');
  const [isResultsExpanded, setIsResultsExpanded] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const fireworksRef = useRef(null);

  // Contest timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const start = new Date(contest.startTime);
      const end = new Date(contest.endTime);
      
      if (now < start) {
        return Math.floor((start - now) / 1000); // Time until start
      } else if (now <= end) {
        return Math.floor((end - now) / 1000); // Time remaining
      }
      return 0; // Contest ended
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [contest.startTime, contest.endTime]);

  // Problem timer
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch problems data
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const fetchedProblems = await Promise.all(
          problemIds.map(id => 
            axiosClient.get(`/problem/problemById/${id}`)
              .then(res => res.data)
              .catch(err => {
                console.error(`Failed to fetch problem ${id}:`, err);
                return null;
              })
          )
        );
        
        const validProblems = fetchedProblems.filter(p => p !== null);
        
        if (validProblems.length === 0) {
          throw new Error('No valid problems found');
        }
        
        setProblems(validProblems);
        setCode('');
      } catch (err) {
        setError(err.message || "Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [problemIds]);

  // Handle code changes when problem or language changes
  useEffect(() => {
    if (problems.length > 0 && activeProblem < problems.length) {
      const problemId = problems[activeProblem]._id;
      const savedCode = codeByProblemAndLanguage[`${problemId}_${language}`] || '';
      setCode(savedCode);
    }
  }, [activeProblem, language, problems, codeByProblemAndLanguage]);

  // Auto-save functionality
  const saveWorkspace = async () => {
    if (!problems[activeProblem]?._id || code.trim().length === 0) return;
    
    try {
      const problemId = problems[activeProblem]._id;
      setCodeByProblemAndLanguage(prev => ({
        ...prev,
        [`${problemId}_${language}`]: code
      }));
      setLastSaveTime(new Date());
    } catch (err) {
      console.error('Failed to save workspace:', err);
    }
  };

  const debouncedSave = useRef(
    _.debounce(() => {
      saveWorkspace();
    }, 2000)
  ).current;

  useEffect(() => {
    debouncedSave();
    return () => debouncedSave.cancel();
  }, [code, debouncedSave]);

  // Handle code execution
  const handleRunCode = async () => {
    if (!problems[activeProblem]?._id) return;
    
    setIsRunning(true);
    setIsResultsExpanded(true);
    try {
      const response = await axiosClient.post(`/submission/run/${problems[activeProblem]._id}`, {
        code,
        language: language,
      });
      
      const passedCount = response.data.testCases.filter(tc => tc.status_id === 3).length;
      const totalCount = response.data.testCases.length;
      
      setOutput(response.data.testCases[0]?.stdout || 
               response.data.testCases[0]?.compile_output || 
               'No output available');
      
      setTestResults({
        ...response.data,
        passedCount,
        totalCount,
        passed: passedCount === totalCount,
        testCases: response.data.testCases.map(tc => ({
          ...tc,
          passed: tc.status_id === 3,
          statusText: tc.status?.description || 'Unknown',
          time: parseFloat(tc.time).toFixed(3) + 's'
        }))
      });
      
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.message || err.message}`);
      setTestResults(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!problems[activeProblem]?._id) return;
    
    setIsRunning(true);
    setIsResultsExpanded(true);
    setActiveResultTab('testCases');
    
    try {
      const response = await axiosClient.post('/contest/submit', {
        problemId: problems[activeProblem]._id,
        contestId: contest._id,
        code,
        language
      });

      const passedCount = response.data.passedTestCases || 0;
      const totalCount = response.data.totalTestCases || 0;
      
      setOutput(response.data.message || 'Submission successful');
      
      setTestResults({
        ...response.data,
        passedCount,
        totalCount,
        passed: response.data.success || false,
        runtime: response.data.runtime || 0,
        memory: response.data.memory || 0,
        testCases: response.data.testCases?.map(tc => ({
          ...tc,
          passed: tc.status_id === 3,
          statusText: tc.status?.description || 'Unknown',
          time: parseFloat(tc.time || 0).toFixed(3) + 's'
        })) || []
      });

      if (response.data.success) {
        setShowSuccessModal(true);
        if (fireworksRef.current) {
          fireworksRef.current.run();
        }
      }
      
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.message || err.message}`);
      setTestResults(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleLanguageChange = (lang) => {
    if (problems.length > 0 && activeProblem < problems.length) {
      const problemId = problems[activeProblem]._id;
      
      setCodeByProblemAndLanguage(prev => ({
        ...prev,
        [`${problemId}_${language}`]: code
      }));
      
      setLanguage(lang);
    }
  };

  const handleProblemChange = (index) => {
    if (index >= 0 && index < problems.length) {
      const problemId = problems[activeProblem]._id;
      setCodeByProblemAndLanguage(prev => ({
        ...prev,
        [`${problemId}_${language}`]: code
      }));
      
      setActiveProblem(index);
      setTestResults(null);
      setOutput('');
      setTimeElapsed(0);
    }
  };

  const getContestStatus = () => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    
    if (now < start) return 'upcoming';
    if (now <= end) return 'ongoing';
    return 'ended';
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'text-emerald-500';
      case 'medium': return 'text-amber-500';
      case 'hard': return 'text-rose-500';
      default: return 'text-gray-500';
    }
  };

  const getDifficultyBgColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return darkMode ? 'bg-emerald-900/30' : 'bg-emerald-100';
      case 'medium': return darkMode ? 'bg-amber-900/30' : 'bg-amber-100';
      case 'hard': return darkMode ? 'bg-rose-900/30' : 'bg-rose-100';
      default: return darkMode ? 'bg-gray-700' : 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center p-6 max-w-md">
          <div className={`text-lg font-medium mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Workspace
          </button>
        </div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center p-6 max-w-md">
          <div className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            No problems available for this contest
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Workspace
          </button>
        </div>
      </div>
    );
  }

  const contestStatus = getContestStatus();
  const currentProblem = problems[activeProblem];

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Fireworks Effect */}
      <Fireworks
        ref={fireworksRef}
        autorun={false}
        className="fixed inset-0 pointer-events-none z-50"
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center transform transition-all duration-300 scale-95 animate-fade-in">
            <div className="text-green-500 text-6xl mb-4 animate-bounce-in">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Problem Solved!</h2>
            <p className="text-gray-600 mb-4">You've successfully solved this contest problem.</p>
            
            <div className="mb-6 space-y-2">
              <p className="text-gray-500 text-sm">Time taken: {formatTime(timeElapsed)}</p>
              {testResults?.runtime && (
                <p className="text-gray-500 text-sm">Runtime: {testResults.runtime} ms</p>
              )}
              {testResults?.memory && (
                <p className="text-gray-500 text-sm">Memory: {testResults.memory} KB</p>
              )}
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  if (fireworksRef.current) {
                    fireworksRef.current.stop();
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Coding
              </button>
              {activeProblem < problems.length - 1 && (
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    handleProblemChange(activeProblem + 1);
                    if (fireworksRef.current) {
                      fireworksRef.current.stop();
                    }
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Next Problem
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`py-3 px-6 flex justify-between items-center border-b ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} shadow-sm`}>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-all ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <FiX size={20} />
          </motion.button>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {contest.title}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm flex items-center ${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
            <span>Problem {activeProblem + 1} of {problems.length}</span>
          </div>
          
          <div className={`px-4 py-2 rounded-lg flex items-center ${
            contestStatus === 'ended' ? 
              (darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600') :
            timeLeft < 300 ? 
              'bg-red-100 text-red-800 animate-pulse' : 
              (darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800')
          }`}>
            <FiClock className="mr-2" size={18} />
            <div className="text-center">
              <div className="text-xs font-medium">
                {contestStatus === 'upcoming' ? 'Starts in' : 
                 contestStatus === 'ongoing' ? 'Time Left' : 'Contest Ended'}
              </div>
              <div className="font-bold text-lg tracking-wider">
                {contestStatus !== 'ended' ? formatTime(timeLeft) : '--:--:--'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem List - Collapsible */}
        <motion.div 
          className={`${darkMode ? 'bg-gray-900' : 'bg-white'} border-r ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex flex-col transition-all duration-300`}
          initial={{ width: 280 }}
          animate={{ width: isProblemListCollapsed ? 0 : 280 }}
        >
          {!isProblemListCollapsed && (
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`flex items-center font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <FiList className="mr-2" />
                  Problems
                </h3>
                <motion.button 
                  onClick={() => setIsProblemListCollapsed(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-1 rounded ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <FiChevronLeft size={18} />
                </motion.button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {problems.map((problem, index) => (
                  <motion.div
                    key={problem._id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProblemChange(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${activeProblem === index 
                      ? darkMode 
                        ? 'bg-gray-800 shadow-lg border-l-4 border-blue-500' 
                        : 'bg-gray-100 shadow-sm border-l-4 border-blue-400'
                      : darkMode 
                        ? 'hover:bg-gray-800/50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-medium truncate ${activeProblem === index ? (darkMode ? 'text-blue-400' : 'text-blue-600') : (darkMode ? 'text-white' : 'text-gray-800')}`}>
                        {problem.title}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)} ${getDifficultyBgColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className={`text-xs mt-1 truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {problem.category || 'Algorithm'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Collapse/Expand Button */}
        {isProblemListCollapsed && (
          <motion.button
            onClick={() => setIsProblemListCollapsed(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-r-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-600'} shadow-lg z-10`}
          >
            <FiChevronRight size={18} />
          </motion.button>
        )}

        {/* Problem & Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Problem Description */}
          <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {currentProblem.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(currentProblem.difficulty)} ${getDifficultyBgColor(currentProblem.difficulty)}`}>
                      {currentProblem.difficulty}
                    </span>
                    <span className={`text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <FiClock className="mr-1" size={12} />
                      {currentProblem.timeLimit || '1s'}
                    </span>
                    <span className={`text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <FiCode className="mr-1" size={12} />
                      {currentProblem.memoryLimit || '256MB'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => handleProblemChange(activeProblem - 1)}
                    disabled={activeProblem === 0}
                    whileHover={{ scale: activeProblem > 0 ? 1.1 : 1 }}
                    whileTap={{ scale: activeProblem > 0 ? 0.95 : 1 }}
                    className={`p-2 rounded-full ${activeProblem === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    <FiChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleProblemChange(activeProblem + 1)}
                    disabled={activeProblem === problems.length - 1}
                    whileHover={{ scale: activeProblem < problems.length - 1 ? 1.1 : 1 }}
                    whileTap={{ scale: activeProblem < problems.length - 1 ? 0.95 : 1 }}
                    className={`p-2 rounded-full ${activeProblem === problems.length - 1 ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    <FiChevronRight size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Problem Description with Markdown */}
              <div className={`prose prose-sm max-w-none ${darkMode ? 'prose-invert' : ''} prose-headings:font-semibold prose-code:before:hidden prose-code:after:hidden`}>
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre: ({node, ...props}) => (
                      <div className={`rounded-lg overflow-hidden my-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <pre {...props} className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-4 overflow-x-auto text-sm`} />
                      </div>
                    ),
                    code: ({node, ...props}) => (
                      <code {...props} className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded text-sm font-mono`} />
                    ),
                  }}
                >
                  {currentProblem.description}
                </Markdown>
              </div>

              {/* Sample Test Cases */}
              {currentProblem.testCases?.length > 0 && (
                <div className="mt-6">
                  <div 
                    className={`flex items-center justify-between cursor-pointer mb-2 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    onClick={() => setIsTestCasesExpanded(!isTestCasesExpanded)}
                  >
                    <h4 className={`text-md font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <FiAlertCircle className="mr-2" />
                      Sample Test Cases
                    </h4>
                    {isTestCasesExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  
                  <AnimatePresence>
                    {isTestCasesExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {currentProblem.testCases.slice(0, 2).map((testCase, index) => (
                          <div key={index} className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <h5 className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Input</h5>
                                <pre className={`whitespace-pre-wrap font-mono text-xs ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {testCase.input}
                                </pre>
                              </div>
                              <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <h5 className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Output</h5>
                                <pre className={`whitespace-pre-wrap font-mono text-xs ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {testCase.output}
                                </pre>
                              </div>
                            </div>
                            {testCase.explanation && (
                              <div className={`mt-1 text-xs p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                <span className="font-medium">Explanation: </span>
                                {testCase.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Editor & Controls */}
          <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex flex-col`} 
               style={{ height: isEditorMaximized ? '70vh' : isResultsExpanded ? '40vh' : '70vh' }}>
            {/* Editor Header */}
            <div className="flex justify-between items-center p-2 bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex space-x-2">
                {['c++', 'java', 'python', 'javascript'].map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex items-center px-3 py-1 rounded-md text-xs ${
                      language === lang 
                        ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                        : darkMode 
                          ? 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {lang === 'c++' && <SiCplusplus className="mr-1" size={12} />}
                    {lang === 'java' && <SiCplusplus className="mr-1" size={12} />}
                    {lang === 'python' && <SiPython className="mr-1" size={12} />}
                    {lang === 'javascript' && <SiJavascript className="mr-1" size={12} />}
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                {lastSaveTime && (
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Saved {lastSaveTime.toLocaleTimeString()}
                  </span>
                )}
                <button
                  onClick={() => setIsEditorMaximized(!isEditorMaximized)}
                  className={`p-1 rounded ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  {isEditorMaximized ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                </button>
              </div>
            </div>
            
            {/* Editor */}
            <div className="flex-1">
              <MonacoEditor
                height="100%"
                language={language}
                value={code}
                onChange={setCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 10 },
                  renderWhitespace: 'selection',
                  lineNumbersMinChars: 3,
                  glyphMargin: true,
                  contextmenu: true,
                  fontFamily: 'Fira Code, monospace',
                  fontLigatures: true,
                  bracketPairColorization: {
                    enabled: true,
                    independentColorPoolPerBracketType: true
                  }
                }}
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme('custom-dark', {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [],
                    colors: {
                      'editor.background': '#111827',
                      'editor.lineHighlightBackground': '#1F2937',
                      'editorLineNumber.foreground': '#6B7280',
                      'editorLineNumber.activeForeground': '#D1D5DB',
                    }
                  });
                }}
                onMount={(editor, monaco) => {
                  if (darkMode) {
                    monaco.editor.setTheme('custom-dark');
                  }
                }}
              />
            </div>
            
            {/* Action Buttons */}
            <div className={`flex justify-between items-center p-2 border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className={`px-3 py-1.5 rounded-md flex items-center text-xs font-medium ${
                    isRunning 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : darkMode 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <FiPlay className="mr-1" size={12} />
                      Run
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmitCode}
                  disabled={isRunning}
                  className={`px-3 py-1.5 rounded-md flex items-center text-xs font-medium ${
                    isRunning 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : darkMode 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-1" size={12} />
                      Submit
                    </>
                  )}
                </motion.button>
                <button
                  onClick={saveWorkspace}
                  className={`px-3 py-1.5 rounded-md flex items-center text-xs font-medium ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FiSave className="mr-1" size={12} />
                  Save
                </button>
              </div>
              <button 
                onClick={() => setIsResultsExpanded(!isResultsExpanded)}
                className={`px-3 py-1.5 rounded-md text-xs flex items-center ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isResultsExpanded ? (
                  <>
                    <FiChevronDown className="mr-1" size={12} />
                    Hide Results
                  </>
                ) : (
                  <>
                    <FiChevronUp className="mr-1" size={12} />
                    Show Results
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          {isResultsExpanded && !isEditorMaximized && (
            <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex flex-col`} style={{ height: '30vh' }}>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button 
                  className={`px-4 py-2 text-xs font-medium flex items-center gap-1 ${
                    activeResultTab === 'testCases' 
                      ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600')
                      : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')
                  }`}
                  onClick={() => setActiveResultTab('testCases')}
                >
                  <FiCheck size={14} />
                  Test Cases
                </button>
                <button 
                  className={`px-4 py-2 text-xs font-medium flex items-center gap-1 ${
                    activeResultTab === 'output' 
                      ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600')
                      : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')
                  }`}
                  onClick={() => setActiveResultTab('output')}
                >
                  <FiAlertTriangle size={14} />
                  Output
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3">
                {activeResultTab === 'testCases' ? (
                  testResults ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div className={`p-2 rounded-lg border ${
                          testResults.passed 
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800' 
                            : 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800'
                        }`}>
                          <p className="text-xs font-medium">Result</p>
                          <p className="text-sm font-bold">
                            {testResults.passed ? 'Passed' : 'Failed'}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                          <p className="text-xs font-medium">Test Cases</p>
                          <p className="text-sm font-bold">
                            {testResults.passedCount}/{testResults.totalCount}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                          <p className="text-xs font-medium">Runtime</p>
                          <p className="text-xs font-mono">
                            {testResults.runtime ? `${testResults.runtime} ms` : 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                          <p className="text-xs font-medium">Memory</p>
                          <p className="text-xs font-mono">
                            {testResults.memory ? `${testResults.memory} KB` : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {testResults.testCases && testResults.testCases.length > 0 ? (
                        <div className="space-y-2">
                          {testResults.testCases.map((testCase, idx) => (
                            <div key={idx} className={`border rounded-lg p-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center">
                                  <span className={`inline-flex items-center justify-center w-5 h-5 mr-1 rounded-full ${
                                    testCase.passed 
                                      ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' 
                                      : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                                  }`}>
                                    {testCase.passed ? <FaCheck className="w-2.5 h-2.5" /> : <FaTimes className="w-2.5 h-2.5" />}
                                  </span>
                                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Test {idx + 1} - {testCase.statusText}
                                  </span>
                                </div>
                                <span className={`text-2xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {testCase.time}
                                </span>
                              </div>
                              
                              {!testCase.passed && (
                                <div className="ml-6 mt-1 space-y-1 text-xs">
                                  <div>
                                    <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Input:</span>
                                    <pre className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-800'} p-1 rounded mt-0.5 font-mono overflow-x-auto`}>
                                      {testCase.stdin || 'No input'}
                                    </pre>
                                  </div>
                                  <div>
                                    <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expected:</span>
                                    <pre className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-800'} p-1 rounded mt-0.5 font-mono overflow-x-auto`}>
                                      {testCase.expected_output || 'No expected output'}
                                    </pre>
                                  </div>
                                  <div>
                                    <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actual:</span>
                                    <pre className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-800'} p-1 rounded mt-0.5 font-mono overflow-x-auto`}>
                                      {testCase.stdout || testCase.compile_output || 'No output'}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-center py-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No test cases available for this submission
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center h-full ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs`}>
                      Submit your code to see results
                    </div>
                  )
                ) : (
                  <div className="h-full flex flex-col">
                    {output ? (
                      <>
                        <pre className={`flex-1 text-xs font-mono p-2 rounded overflow-x-auto ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
                          {output}
                        </pre>
                        {testResults && (
                          <div className={`mt-1 text-2xs flex justify-between px-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            <span>Runtime: {testResults.runtime || 0} ms</span>
                            <span>Memory: {testResults.memory || 0} KB</span>
                            <span className={`font-medium ${
                              testResults.passed 
                                ? (darkMode ? 'text-green-400' : 'text-green-600') 
                                : (darkMode ? 'text-red-400' : 'text-red-600')
                            }`}>
                              {testResults.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={`flex items-center justify-center h-full ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs`}>
                        No output available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestWorkspace;