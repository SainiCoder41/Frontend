import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../utils/axiosClient';
import { useLocation } from 'react-router';
import Editor from '@monaco-editor/react';
import { FaCode, FaHistory, FaRobot, FaLightbulb, FaBook, FaPlay, FaPaperPlane, FaCheck, FaTimes } from 'react-icons/fa';
import { SiCplusplus, SiJavascript } from 'react-icons/si';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import ChatAi from '../Components/ChatAi';
import Editorial from '../Components/Editorial';
import '../App.css';

import SubmissionPanel from '../Components/SubmissionPanel';

const ProblemPage = () => {
  const location = useLocation();
  const { id } = location?.state;
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeResultTab, setActiveResultTab] = useState('testCases');
  const [activeTab, setActiveTab] = useState('description');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fireworksRef = useRef(null);

  // Timer functionality
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch the problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosClient.get(`/problem/problemById/${id}`);
        setProblem(response.data);
        const defaultCode = response.data.startCode.find(c => c.language === language)?.initialCode || '';
        setCode(defaultCode);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, language]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const newCode = problem.startCode.find(c => c.language === lang)?.initialCode || '';
    setCode(newCode);
  };

  // Handle code execution
  const handleRunCode = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post(`/submission/run/${id}`, {
        code,
        language: language,
      });
      
      // Process the response for display
      const passedCount = response.data.testCases.filter(tc => tc.status_id === 3).length;
      const totalCount = response.data.testCases.length;
      const runtime = response.data.runtime;
      const memory = response.data.memory;
      
      setOutput(response.data.testCases[0]?.stdout || response.data.testCases[0]?.compile_output || 'No output available');
      
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
      setIsSubmitting(false);
    }
  };
 

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post(`/submission/submit/${id}`, {
        code,
        language
      });
      
      // Process the submission response
      const passedCount = response.data.passedTestCases;
      const totalCount = response.data.totalTestCases;
      const runtime = response.data.runtime;
      const memory = response.data.memory;
      const accepted = response.data.success;
      
      setOutput(response.data.message);
      
      setTestResults({
        ...response.data,
        passedCount,
        totalCount,
        passed: accepted,
        runtime,
        memory,
        testCases: response.data.testCases.map(tc => ({
          ...tc,
          passed: tc.status_id === 3,
          statusText: tc.status?.description || 'Unknown',
          time: parseFloat(tc.time).toFixed(3) + 's'
        }))
      });

      // Show success modal if all test cases passed
      if (accepted) {
        setShowSuccessModal(true);
        if (fireworksRef.current) {
          fireworksRef.current.run();
        }
      }
      
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.message || err.message}`);
      setTestResults(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  if (!problem) return <div className="flex items-center justify-center h-screen">Problem not found</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
            <p className="text-gray-600 mb-6">You've successfully solved "{problem.title}"!</p>
            <div className="mb-6">
              <p className="text-gray-500 text-sm">Time taken: {formatTime(timeElapsed)}</p>
              <p className="text-gray-500 text-sm">Difficulty: {problem.difficulty}</p>
            </div>
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
          </div>
        </div>
      )}

      {/* Left Panel - Problem Description */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Problem Header */}
          <div className="flex flex-col space-y-4 mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {problem.title}
                </h1>
                
                <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                  problem.difficulty === 'easy' ? 'bg-green-50 text-green-700 border border-green-200' :
                  problem.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {problem.difficulty === 'easy' ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : problem.difficulty === 'medium' ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={`p-1 rounded-full ${isRunning ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {isRunning ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTime(timeElapsed)}</span>
                  </div>
                  
                  {timeElapsed > 0 && (
                    <button 
                      onClick={() => setTimeElapsed(0)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {problem.tags.split(',').map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-full flex items-center gap-1 border border-gray-200 hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`pb-2 px-4 font-medium text-sm ${activeTab === 'description' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('description')}
            >
              <FaBook className="inline mr-2" /> Description
            </button>
            <button
              className={`pb-2 px-4 font-medium text-sm ${activeTab === 'submissions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('submissions')}
            >
              <FaHistory className="inline mr-2" /> Submissions
            </button>
            <button
              className={`pb-2 px-4 font-medium text-sm ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('chat')}
            >
              <FaRobot className="inline mr-2" /> AI Help
            </button>

             <button
              className={`pb-2 px-4 font-medium text-sm ${activeTab === 'Editorial' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('Editorial')}
            >
       <FaPlay className="text-blue " /> Editorial
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'description' && (
              <>
                <div className="prose prose-sm max-w-none">
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-blue-600 mb-4">Problem Description</h3>
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      <p className="whitespace-pre-line">{problem.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="mt-8">
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div 
                          key={index} 
                          className="bg-gray-800 p-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                        >
                          <h4 className="font-semibold mb-2 text-yellow-400">Example {index + 1}:</h4>
                          <div className="space-y-2 text-sm font-mono">
                            <div className="flex">
                              <strong className="text-gray-400 w-20 flex-shrink-0">Input:</strong>
                              <span className="text-gray-200 bg-gray-700 px-2 py-1 rounded">
                                {example.input}
                              </span>
                            </div>
                            <div className="flex">
                              <strong className="text-gray-400 w-20 flex-shrink-0">Output:</strong>
                              <span className="text-gray-200 bg-gray-700 px-2 py-1 rounded">
                                {example.output}
                              </span>
                            </div>
                            {example.explanation && (
                              <div>
                                <strong className="text-gray-400 w-20 flex-shrink-0">Explanation:</strong>
                                <span className="text-gray-300 italic bg-gray-700 px-2 py-1 rounded">
                                  {example.explanation}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'submissions' && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                {/* <h2 className="font-semibold text-gray-800 mb-3">Submission History</h2>
                <p className="text-gray-500 text-sm">No submissions yet</p> */}
               <SubmissionPanel id={id} />
              </div>
            )}
            
            {activeTab === 'chat' && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                {/* <h2 className="font-semibold text-gray-800 mb-3">AI Assistant</h2>
                <p className="text-gray-500 text-sm">Ask questions about this problem</p> */}
                <ChatAi problem={problem}></ChatAi>
              </div>
            )}
              {activeTab === 'Editorial' && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                {/* <h2 className="font-semibold text-gray-800 mb-3">AI Assistant</h2>
                <p className="text-gray-500 text-sm">Ask questions about this problem</p> */}
              <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}></Editorial>
              </div>
            )}
              
          </div>
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="w-1/2 flex flex-col border-l border-gray-200 bg-white">
        {/* Language Selector */}
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-2">
            <button 
              className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
                language === 'c++' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleLanguageChange('c++')}
            >
              <SiCplusplus className="mr-2" /> C++
            </button>
            <button 
              className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
                language === 'java' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleLanguageChange('java')}
            >
              Java
            </button>
            <button 
              className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
                language === 'javascript' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleLanguageChange('javascript')}
            >
              <SiJavascript className="mr-2" /> JavaScript
            </button>
          </div>
        </div>
        
        {/* Code Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
            }}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            onClick={handleRunCode}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Running...' : (
              <>
                <FaPlay className="mr-2" /> Run Code
              </>
            )}
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSubmitCode}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : (
              <>
                <FaPaperPlane className="mr-2" /> Submit
              </>
            )}
          </button>
        </div>
        
        {/* Test Results Panel */}
        <div className="border-t border-gray-200 bg-white flex flex-col" style={{ height: '30%' }}>
          <div className="flex border-b border-gray-200">
            <button 
              className={`px-4 py-3 text-sm font-medium ${
                activeResultTab === 'testCases' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveResultTab('testCases')}
            >
              Test Cases
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium ${
                activeResultTab === 'output' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveResultTab('output')}
            >
              Output
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {activeResultTab === 'testCases' ? (
              testResults ? (
                <div className="space-y-4">
                  {/* Summary Section */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className={`p-3 rounded-lg border ${
                      testResults.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <p className="text-xs font-medium">Result</p>
                      <p className="text-lg font-bold">
                        {testResults.passed ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-xs font-medium">Test Cases</p>
                      <p className="text-lg font-bold">
                        {testResults.passedCount}/{testResults.totalCount}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium">Runtime</p>
                      <p className="text-sm font-mono">
                        {testResults.runtime ? `${testResults.runtime} ms` : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium">Memory</p>
                      <p className="text-sm font-mono">
                        {testResults.memory ? `${testResults.memory} KB` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Test Cases */}
                  <div className="space-y-3">
                    {testResults.testCases?.map((testCase, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full ${
                              testCase.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {testCase.passed ? <FaCheck className="w-3 h-3" /> : <FaTimes className="w-3 h-3" />}
                            </span>
                            <span className="text-sm font-medium">
                              Test Case {idx + 1} - {testCase.statusText}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {testCase.time}
                          </span>
                        </div>
                        
                        {!testCase.passed && (
                          <div className="ml-8 mt-2 space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Input:</span>
                              <pre className="bg-gray-50 p-2 rounded mt-1 font-mono overflow-x-auto">
                                {testCase.stdin || 'No input'}
                              </pre>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Expected:</span>
                              <pre className="bg-gray-50 p-2 rounded mt-1 font-mono overflow-x-auto">
                                {testCase.expected_output || 'No expected output'}
                              </pre>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Actual:</span>
                              <pre className="bg-gray-50 p-2 rounded mt-1 font-mono overflow-x-auto">
                                {testCase.stdout || testCase.compile_output || 'No output'}
                              </pre>
                            </div>
                            {testCase.stderr && (
                              <div>
                                <span className="font-medium text-gray-600">Error:</span>
                                <pre className="bg-red-50 text-red-600 p-2 rounded mt-1 font-mono overflow-x-auto">
                                  {testCase.stderr}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Run your code to see test results
                </div>
              )
            ) : (
              <div className="h-full flex flex-col">
                {output ? (
                  <>
                    <pre className="flex-1 text-sm font-mono bg-gray-50 p-3 rounded overflow-x-auto">
                      {output}
                    </pre>
                    {testResults && (
                      <div className="mt-2 text-xs text-gray-500 flex justify-between px-2">
                        <span>Runtime: {testResults.runtime || 0} ms</span>
                        <span>Memory: {testResults.memory || 0} KB</span>
                        <span className={`font-medium ${
                          testResults.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {testResults.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No output available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add these styles to your CSS file */}
     
    </div>
  );
};

export default ProblemPage;