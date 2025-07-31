import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Moon, Sun, Plus, Minus } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../store/themeSlice';
import { FiCode, FiGithub, FiSun, FiMoon } from 'react-icons/fi';

const DSVisualizer = () => {
  // Redux state for dark mode
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  // Component state
  const [array, setArray] = useState([]);
  const [customArrayInput, setCustomArrayInput] = useState('');
  const [target, setTarget] = useState(0);
  const [algorithm, setAlgorithm] = useState('linear');
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [speed, setSpeed] = useState(500);
  const [history, setHistory] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const containerRef = useRef(null);

  // Generate random array
  const generateArray = () => {
    const size = 15;
    const min = 1;
    const max = 100;
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    ).sort((a, b) => a - b);
    setArray(newArray);
    setTarget(Math.floor(Math.random() * (max - min + 1)) + min);
    resetVisualization();
  };

  // Handle custom array input
  const handleCustomArraySubmit = () => {
    try {
      const newArray = customArrayInput
        .split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));
      
      if (newArray.length > 0) {
        const sortedArray = [...newArray].sort((a, b) => a - b);
        setArray(algorithm === 'binary' ? sortedArray : newArray);
        setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
        resetVisualization();
        setShowCustomInput(false);
      }
    } catch (error) {
      console.error('Invalid array input:', error);
    }
  };

  // Initialize on mount
  useEffect(() => {
    generateArray();
  }, []);

  // Algorithm visualizations
  const linearSearch = async () => {
    setIsRunning(true);
    setFoundIndex(-1);
    const steps = [];
    
    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      steps.push({ index: i, value: array[i], action: 'check' });
      
      if (array[i] === target) {
        setFoundIndex(i);
        steps.push({ index: i, value: array[i], action: 'found' });
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setHistory(steps);
    setIsRunning(false);
  };

  const binarySearch = async () => {
    setIsRunning(true);
    setFoundIndex(-1);
    const steps = [];
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setCurrentIndex(mid);
      steps.push({ index: mid, value: array[mid], action: 'check' });
      
      if (array[mid] === target) {
        setFoundIndex(mid);
        steps.push({ index: mid, value: array[mid], action: 'found' });
        break;
      } else if (array[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
      
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setHistory(steps);
    setIsRunning(false);
  };

  const runAlgorithm = () => {
    if (isRunning) return;
    algorithm === 'linear' ? linearSearch() : binarySearch();
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setHistory([]);
  };

  // Enhanced dark mode toggle with animation
  const toggleDarkModeHandler = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header with improved dark mode toggle */}
       <header className="flex justify-between items-center mb-10 px-1 py-3 border-b dark:border-gray-700 border-gray-200">
  <div className="flex items-center space-x-3">
    <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-blue-100'} shadow-sm`}>
      <FiCode className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-blue-600'}`} />
    </div>
    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
      Codex Visualizer
    </h1>
  </div>
  
  <div className="flex items-center space-x-4">
    {/* <a 
      href="https://github.com/yourusername/yourrepo" 
      target="_blank" 
      rel="noopener noreferrer"
      className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
      aria-label="GitHub Repository"
    >
      <FiGithub className="h-5 w-5" />
    </a> */}
    
  </div>
</header>

        {/* Enhanced Controls Section */}
        <div className={`rounded-xl shadow-xl p-6 mb-8 transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
           <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
  {/* Algorithm Selector */}
  <div className="relative w-full sm:w-auto">
    <select
      value={algorithm}
      onChange={(e) => {
        setAlgorithm(e.target.value);
        if (e.target.value === 'binary') {
          setArray([...array].sort((a, b) => a - b));
        }
      }}
      className={`w-full px-4 py-2.5 rounded-lg appearance-none transition-all duration-200 ${
        darkMode
          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-purple-500'
          : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500'
      } border ${
        isRunning ? 'opacity-70 cursor-not-allowed' : 'opacity-100 cursor-pointer'
      } pr-10`}
      disabled={isRunning}
    >
      <option value="linear">Linear Search</option>
      <option value="binary">Binary Search</option>
    </select>
    <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
      darkMode ? 'text-gray-300' : 'text-gray-500'
    }`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>

  {/* Target Input */}
  <div className="relative w-full sm:w-auto">
    <input
      type="number"
      value={target}
      onChange={(e) => {
        const value = Number(e.target.value);
        if (value >= Math.min(...array) && value <= Math.max(...array)) {
          setTarget(value);
        }
      }}
      min={Math.min(...array)}
      max={Math.max(...array)}
      className={`w-full px-4 py-2.5 rounded-lg transition-all duration-200 ${
        darkMode
          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-purple-500'
          : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500'
      } border ${
        isRunning ? 'opacity-70 cursor-not-allowed' : 'opacity-100'
      } pr-10`}
      disabled={isRunning}
      onFocus={(e) => e.target.select()}
      placeholder="Search target"
    />
    <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
      darkMode ? 'text-purple-300' : 'text-purple-600'
    }`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <span className={`absolute -top-2 left-3 text-xs px-2 py-0.5 rounded-full ${
      darkMode ? 'bg-purple-600' : 'bg-purple-500'
    } text-white font-medium shadow-sm`}>
      Target
    </span>
  </div>
</div>

              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={`px-3 py-2 rounded-lg flex items-center gap-1 text-sm ${darkMode ? 'bg-gray-700 hover:bg-blue-600 text-white ' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {showCustomInput ? <Minus size={14} /> : <Plus size={14} />}
                Custom Array
              </button>
            </div>

            {showCustomInput && (
              <div className="w-full flex gap-2 items-center">
                <input
                  type="text"
                  value={customArrayInput}
                  onChange={(e) => setCustomArrayInput(e.target.value)}
                  placeholder="Enter comma-separated numbers (e.g., 5,3,9,1)"
                  className={`flex-1 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
                <button
                  onClick={handleCustomArraySubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between mt-4">
            <div className="flex gap-4">
              <button
                onClick={runAlgorithm}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${isRunning 
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform hover:scale-105'}`}
              >
                {isRunning ? (
                  <Pause size={18} className="animate-pulse" />
                ) : (
                  <Play size={18} className="animate-bounce" />
                )}
                {isRunning ? 'Running...' : 'Run'}
              </button>
              
              <button
                onClick={resetVisualization}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${darkMode ? 'bg-gray-700 hover:bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} shadow-md`}
              >
                <RotateCcw size={18} />
                Reset
              </button>
              
              <button
                onClick={generateArray}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg transition-all ${darkMode ? 'bg-gray-700 hover:bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} shadow-md`}
              >
                Random Array
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Speed:</span>
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-32 accent-blue-600"
                disabled={isRunning}
              />
              <span className={`text-sm w-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {1000 - speed}ms
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Visualization Area */}
        <div className={`rounded-xl shadow-xl p-6 mb-8 transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`${darkMode?'text-white font-semibold text-3xl':' text-black font-semibold text-3xl'}`}>
              {algorithm === 'linear' ? 'Linear Search' : 'Binary Search'} Visualization
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
              Array Size: {array.length}
            </div>
          </div>
          
          <div 
            ref={containerRef}
            className="flex flex-wrap gap-4 items-end justify-center min-h-[200px] py-4"
          >
            {array.map((value, index) => {
              let bgColor = darkMode ? 'bg-blue-900' : 'bg-blue-200';
              let textColor = darkMode ? 'text-white' : 'text-gray-800';
              
              if (index === currentIndex) {
                bgColor = darkMode ? 'bg-yellow-600' : 'bg-yellow-400';
                textColor = 'text-gray-900';
              }
              if (index === foundIndex) {
                bgColor = darkMode ? 'bg-green-600' : 'bg-green-400';
                textColor = 'text-white';
              }
              
              return (
                <div 
                  key={index} 
                  className={`flex flex-col items-center transition-all duration-300 ${bgColor} ${textColor} rounded-lg w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg relative`}
                  style={{ 
                    height: `${value * 3}px`,
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <span className="absolute -bottom-6 text-sm font-medium">{value}</span>
                  {index === currentIndex && (
                    <span className={`absolute -top-6 text-xs font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      {algorithm === 'binary' ? 'Mid' : 'Current'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Current status indicator */}
          <div className={`mt-4 p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {isRunning ? (
              <span className="text-yellow-500 animate-pulse">Searching...</span>
            ) : foundIndex >= 0 ? (
              <span className="text-green-500 font-medium">
                Found target {target} at index {foundIndex}!
              </span>
            ) : history.length > 0 ? (
              <span className="text-red-500 font-medium">
                Target {target} not found in array
              </span>
            ) : (
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {algorithm === 'binary' 
                  ? 'Array is sorted for binary search' 
                  : 'Ready to search'}
              </span>
            )}
          </div>
        </div>

        {/* History Table */}
        <div className={`rounded-xl shadow-xl p-6 mb-8 transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`${darkMode?'text-xl font-semibold mb-4 text-white':'text-xl font-semibold mb-4'}`}>Execution Steps</h2>
          <div className="overflow-auto max-h-64">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-4 py-2 text-left">Step</th>
                  <th className="px-4 py-2 text-left">Index</th>
                  <th className="px-4 py-2 text-left">Value</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 text-white' : 'divide-gray-200'}`}>
                {history.map((step, i) => (
                  <tr key={i} className={step.action === 'found' ? (darkMode ? 'bg-green-900 ' : 'bg-green-100') : ''}>
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{step.index}</td>
                    <td className="px-4 py-2">{step.value}</td>
                    <td className="px-4 py-2 capitalize">
                      {step.action === 'found' ? (
                        <span className="font-bold text-green-600 dark:text-green-400">Found!</span>
                      ) : (
                        'Checking'
                      )}
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan="4" className={`px-4 py-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Run the algorithm to see steps
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className={`rounded-xl shadow-xl p-6 transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`${darkMode?'text-xl font-semibold mb-4 text-white':'text-xl font-semibold mb-4'}`}>Algorithm Explanation</h2>
          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {algorithm === 'linear' ? (
              <>
                <p className="mb-3"><strong className="text-blue-500">Linear Search</strong> is a simple searching algorithm that checks each element in the array sequentially until it finds the target value.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Time Complexity:</strong> O(n) - checks each element once in worst case</li>
                  <li><strong>Space Complexity:</strong> O(1) - uses constant space</li>
                  <li><strong>Works</strong> on both sorted and unsorted arrays</li>
                  <li><strong>Best for</strong> small datasets or unsorted data</li>
                </ul>
              </>
            ) : (
              <>
                <p className="mb-3"><strong className="text-blue-500">Binary Search</strong> is an efficient algorithm for finding an item in a sorted array by repeatedly dividing the search interval in half.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Time Complexity:</strong> O(log n) - halves search space each iteration</li>
                  <li><strong>Space Complexity:</strong> O(1) - uses constant space</li>
                  <li><strong>Requires</strong> the array to be sorted</li>
                  <li><strong>Best for</strong> large sorted datasets</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSVisualizer;