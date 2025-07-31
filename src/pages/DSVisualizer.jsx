import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, ChevronDown } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../store/themeSlice';
import { FiCode, FiGithub, FiInfo } from 'react-icons/fi';

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
  const [currentIndices, setCurrentIndices] = useState([]);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [speed, setSpeed] = useState(500);
  const [history, setHistory] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [arraySize, setArraySize] = useState(15);
  const containerRef = useRef(null);

  // Algorithm categories
  const algorithmCategories = {
    'Search Algorithms': [
      { value: 'linear', label: 'Linear Search' },
      { value: 'binary', label: 'Binary Search' }
    ],
    'Sorting Algorithms': [
      { value: 'bubble', label: 'Bubble Sort' },
      { value: 'selection', label: 'Selection Sort' },
      { value: 'insertion', label: 'Insertion Sort' },
      { value: 'merge', label: 'Merge Sort' },
      { value: 'quick', label: 'Quick Sort' }
    ]
  };

  // Generate random array
  const generateArray = () => {
    const min = 1;
    const max = 100;
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
    
    // For binary search, ensure array is sorted
    if (algorithm === 'binary') {
      newArray.sort((a, b) => a - b);
    }
    
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
        setArraySize(newArray.length);
      }
    } catch (error) {
      console.error('Invalid array input:', error);
    }
  };

  // Initialize on mount
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Reset when algorithm changes
  useEffect(() => {
    if (algorithm === 'binary') {
      setArray([...array].sort((a, b) => a - b));
    }
    resetVisualization();
  }, [algorithm]);

  // Algorithm implementations
  const linearSearch = async () => {
    setIsRunning(true);
    setFoundIndex(-1);
    const steps = [];
    
    for (let i = 0; i < array.length; i++) {
      setCurrentIndices([i]);
      steps.push({ indices: [i], values: [array[i]], action: 'check' });
      
      if (array[i] === target) {
        setFoundIndex(i);
        steps.push({ indices: [i], values: [array[i]], action: 'found' });
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
      setCurrentIndices([mid, left, right]);
      steps.push({ indices: [mid, left, right], values: [array[mid], array[left], array[right]], action: 'check' });
      
      if (array[mid] === target) {
        setFoundIndex(mid);
        steps.push({ indices: [mid], values: [array[mid]], action: 'found' });
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

  const bubbleSort = async () => {
    setIsRunning(true);
    let arr = [...array];
    const steps = [];
    let swapped;
    
    for (let i = 0; i < arr.length; i++) {
      swapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        setCurrentIndices([j, j + 1]);
        steps.push({ indices: [j, j + 1], values: [arr[j], arr[j + 1]], action: 'compare' });
        
        if (arr[j] > arr[j + 1]) {
          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          steps.push({ indices: [j, j + 1], values: [arr[j], arr[j + 1]], action: 'swap' });
          swapped = true;
        }
        
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      if (!swapped) break;
    }
    
    setHistory(steps);
    setIsRunning(false);
  };

  const selectionSort = async () => {
    setIsRunning(true);
    let arr = [...array];
    const steps = [];
    
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      
      for (let j = i + 1; j < arr.length; j++) {
        setCurrentIndices([minIndex, j]);
        steps.push({ indices: [minIndex, j], values: [arr[minIndex], arr[j]], action: 'compare' });
        
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
        
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
      
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setArray([...arr]);
        steps.push({ indices: [i, minIndex], values: [arr[i], arr[minIndex]], action: 'swap' });
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }
    
    setHistory(steps);
    setIsRunning(false);
  };

  const insertionSort = async () => {
    setIsRunning(true);
    let arr = [...array];
    const steps = [];
    
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      
      while (j >= 0 && arr[j] > key) {
        setCurrentIndices([j, j + 1]);
        steps.push({ indices: [j, j + 1], values: [arr[j], arr[j + 1]], action: 'compare' });
        
        arr[j + 1] = arr[j];
        setArray([...arr]);
        steps.push({ indices: [j, j + 1], values: [arr[j], arr[j + 1]], action: 'shift' });
        
        j--;
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      arr[j + 1] = key;
      setArray([...arr]);
      steps.push({ indices: [j + 1], values: [key], action: 'insert' });
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setHistory(steps);
    setIsRunning(false);
  };

  const mergeSort = async () => {
    setIsRunning(true);
    let arr = [...array];
    const steps = [];
    
    const merge = async (arr, l, m, r) => {
      let n1 = m - l + 1;
      let n2 = r - m;
      
      let L = new Array(n1);
      let R = new Array(n2);
      
      for (let i = 0; i < n1; i++) L[i] = arr[l + i];
      for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
      
      let i = 0, j = 0, k = l;
      
      while (i < n1 && j < n2) {
        setCurrentIndices([l + i, m + 1 + j]);
        steps.push({ indices: [l + i, m + 1 + j], values: [L[i], R[j]], action: 'compare' });
        
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }
        
        setArray([...arr]);
        steps.push({ indices: [k], values: [arr[k]], action: 'merge' });
        k++;
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      while (i < n1) {
        arr[k] = L[i];
        setArray([...arr]);
        steps.push({ indices: [k], values: [arr[k]], action: 'merge' });
        i++;
        k++;
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      while (j < n2) {
        arr[k] = R[j];
        setArray([...arr]);
        steps.push({ indices: [k], values: [arr[k]], action: 'merge' });
        j++;
        k++;
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    };
    
    const sort = async (arr, l, r) => {
      if (l >= r) return;
      
      let m = l + Math.floor((r - l) / 2);
      await sort(arr, l, m);
      await sort(arr, m + 1, r);
      await merge(arr, l, m, r);
    };
    
    await sort(arr, 0, arr.length - 1);
    setHistory(steps);
    setIsRunning(false);
  };

  const quickSort = async () => {
    setIsRunning(true);
    let arr = [...array];
    const steps = [];
    
    const partition = async (arr, low, high) => {
      let pivot = arr[high];
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        setCurrentIndices([j, high]);
        steps.push({ indices: [j, high], values: [arr[j], pivot], action: 'compare' });
        
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          steps.push({ indices: [i, j], values: [arr[i], arr[j]], action: 'swap' });
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
      
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      steps.push({ indices: [i + 1, high], values: [arr[i + 1], arr[high]], action: 'swap' });
      await new Promise(resolve => setTimeout(resolve, speed));
      
      return i + 1;
    };
    
    const sort = async (arr, low, high) => {
      if (low < high) {
        let pi = await partition(arr, low, high);
        await sort(arr, low, pi - 1);
        await sort(arr, pi + 1, high);
      }
    };
    
    await sort(arr, 0, arr.length - 1);
    setHistory(steps);
    setIsRunning(false);
  };

  const runAlgorithm = () => {
    if (isRunning) return;
    
    switch (algorithm) {
      case 'linear':
        linearSearch();
        break;
      case 'binary':
        binarySearch();
        break;
      case 'bubble':
        bubbleSort();
        break;
      case 'selection':
        selectionSort();
        break;
      case 'insertion':
        insertionSort();
        break;
      case 'merge':
        mergeSort();
        break;
      case 'quick':
        quickSort();
        break;
      default:
        linearSearch();
    }
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setCurrentIndices([]);
    setFoundIndex(-1);
    setHistory([]);
  };

  const toggleDarkModeHandler = () => {
    dispatch(toggleDarkMode());
  };

  const isSearchAlgorithm = () => {
    return algorithm === 'linear' || algorithm === 'binary';
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-blue-100'} shadow-sm`}>
              <FiCode className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-blue-600'}`} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Algorithm Visualizer
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
              aria-label="Information"
            >
              <FiInfo className="h-5 w-5" />
            </button>
            <button
              onClick={toggleDarkModeHandler}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700 text-yellow-300' : 'hover:bg-gray-200 text-gray-600'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Information Modal */}
        {showInfo && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300`}>
            <div className={`relative rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <button
                onClick={() => setShowInfo(false)}
                className={`absolute top-4 right-4 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Algorithm Visualizer Guide
              </h2>
              <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>
                  This interactive tool helps you visualize how different search and sorting algorithms work. 
                  You can customize the array, adjust the speed, and see step-by-step execution.
                </p>
                <h3 className="font-semibold text-lg">Features:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Visualize 2 search algorithms (Linear, Binary) and 5 sorting algorithms (Bubble, Selection, Insertion, Merge, Quick)</li>
                  <li>Adjust animation speed with the slider</li>
                  <li>Generate random arrays or input your own</li>
                  <li>Step-by-step execution history</li>
                  <li>Detailed algorithm explanations</li>
                  <li>Dark/light mode toggle</li>
                </ul>
                <h3 className="font-semibold text-lg">How to use:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Select an algorithm from the dropdown</li>
                  <li>Adjust settings as needed (array size, speed)</li>
                  <li>Click "Run" to start visualization</li>
                  <li>Use "Reset" to stop and clear visualization</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className={`rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Algorithm Selection */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Algorithm Category
              </label>
              <div className="relative">
                <select
                  value={algorithm}
                  onChange={(e) => {
                    setAlgorithm(e.target.value);
                    resetVisualization();
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
                  {Object.entries(algorithmCategories).map(([category, algorithms]) => (
                    <optgroup label={category} key={category}>
                      {algorithms.map((algo) => (
                        <option value={algo.value} key={algo.value}>{algo.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Target Input (for search algorithms) */}
            {isSearchAlgorithm() && (
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Search Target
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value)) {
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
                    }`}
                    disabled={isRunning}
                    onFocus={(e) => e.target.select()}
                  />
                  <span className={`absolute -top-2 left-3 text-xs px-2 py-0.5 rounded-full ${
                    darkMode ? 'bg-purple-600' : 'bg-purple-500'
                  } text-white font-medium shadow-sm`}>
                    Target
                  </span>
                </div>
              </div>
            )}

            {/* Array Size Control */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Array Size: {arraySize}
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={arraySize}
                onChange={(e) => {
                  setArraySize(Number(e.target.value));
                  resetVisualization();
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 items-center justify-between mt-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={runAlgorithm}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  isRunning 
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transform hover:scale-105'
                }`}
              >
                {isRunning ? (
                  <Pause size={18} className="animate-pulse" />
                ) : (
                  <Play size={18} className="animate-bounce" />
                )}
                {isRunning ? 'Running...' : 'Run Algorithm'}
              </button>
              
              <button
                onClick={resetVisualization}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                } shadow-md`}
              >
                <RotateCcw size={18} />
                Reset
              </button>
              
              <button
                onClick={generateArray}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg transition-all ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                } shadow-md`}
              >
                Random Array
              </button>
              
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={`px-3 py-2 rounded-lg flex items-center gap-1 text-sm ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {showCustomInput ? <Minus size={14} /> : <Plus size={14} />}
                Custom Array
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Speed:</span>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-32 accent-blue-600"
                disabled={isRunning}
              />
              <span className={`text-sm w-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {1100 - speed}ms
              </span>
            </div>
          </div>

          {/* Custom Array Input */}
          {showCustomInput && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customArrayInput}
                onChange={(e) => setCustomArrayInput(e.target.value)}
                placeholder="Enter comma-separated numbers (e.g., 5,3,9,1)"
                className={`flex-1 px-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                } border`}
              />
              <button
                onClick={handleCustomArraySubmit}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Visualization Area */}
        <div className={`rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            {/* <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {algorithmCategories[Object.keys(algorithmCategories).find(cat => 
                algorithmCategories[cat].some(a => a.value === algorithm)
              ].find(a => a.value === algorithm).label} Visualization
            </h2> */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-800'
            }`}>
              Array Size: {array.length}
            </div>
          </div>
          
          <div 
            ref={containerRef}
            className="flex flex-wrap gap-4 items-end justify-center min-h-[200px] py-4"
          >
            {array.map((value, index) => {
              // Base styling
              let bgColor = darkMode ? 'bg-blue-900/50' : 'bg-blue-200';
              let textColor = darkMode ? 'text-white' : 'text-gray-800';
              let borderColor = darkMode ? 'border-blue-700' : 'border-blue-300';
              
              // Highlight current indices being processed
              if (currentIndices.includes(index)) {
                bgColor = darkMode ? 'bg-yellow-600' : 'bg-yellow-400';
                textColor = 'text-gray-900';
                borderColor = darkMode ? 'border-yellow-700' : 'border-yellow-500';
              }
              
              // Highlight found index (for search)
              if (index === foundIndex) {
                bgColor = darkMode ? 'bg-green-600' : 'bg-green-400';
                textColor = 'text-white';
                borderColor = darkMode ? 'border-green-700' : 'border-green-500';
              }
              
              // For pivot in quick sort
              if (algorithm === 'quick' && currentIndices.length > 0 && index === currentIndices[currentIndices.length - 1]) {
                bgColor = darkMode ? 'bg-purple-600' : 'bg-purple-400';
                textColor = 'text-white';
                borderColor = darkMode ? 'border-purple-700' : 'border-purple-500';
              }
              
              return (
                <div 
                  key={index} 
                  className={`flex flex-col items-center transition-all duration-300 ${bgColor} ${textColor} rounded-lg border-2 ${borderColor} w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg relative`}
                  style={{ 
                    height: `${value * 3}px`,
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <span className="absolute -bottom-6 text-sm font-medium">{value}</span>
                  {currentIndices.includes(index) && (
                    <span className={`absolute -top-6 text-xs font-bold ${
                      darkMode ? 'text-yellow-300' : 'text-yellow-700'
                    }`}>
                      {algorithm === 'binary' && index === currentIndices[0] ? 'Mid' : 
                       algorithm === 'binary' && index === currentIndices[1] ? 'Left' :
                       algorithm === 'binary' && index === currentIndices[2] ? 'Right' :
                       algorithm === 'quick' && index === currentIndices[currentIndices.length - 1] ? 'Pivot' :
                       'Current'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Status Indicator */}
          <div className={`mt-4 p-3 rounded-lg text-center ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {isRunning ? (
              <span className="text-yellow-500 animate-pulse">Processing...</span>
            ) : foundIndex >= 0 ? (
              <span className="text-green-500 font-medium">
                Found target {target} at index {foundIndex}!
              </span>
            ) : history.length > 0 && isSearchAlgorithm() ? (
              <span className="text-red-500 font-medium">
                Target {target} not found in array
              </span>
            ) : history.length > 0 ? (
              <span className="text-green-500 font-medium">
                Array sorted successfully!
              </span>
            ) : (
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {algorithm === 'binary' 
                  ? 'Array is sorted for binary search' 
                  : 'Ready to visualize'}
              </span>
            )}
          </div>
        </div>

        {/* History Table */}
        <div className={`rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Execution Steps
          </h2>
          <div className="overflow-auto max-h-64">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-4 py-2 text-left">Step</th>
                  <th className="px-4 py-2 text-left">Index{currentIndices.length > 1 ? 'es' : ''}</th>
                  <th className="px-4 py-2 text-left">Value{currentIndices.length > 1 ? 's' : ''}</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 text-white' : 'divide-gray-200'}`}>
                {history.map((step, i) => (
                  <tr 
                    key={i} 
                    className={
                      step.action === 'found' ? (darkMode ? 'bg-green-900/30' : 'bg-green-100') :
                      step.action === 'swap' ? (darkMode ? 'bg-purple-900/30' : 'bg-purple-100') :
                      step.action === 'merge' ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-100') : ''
                    }
                  >
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{step.indices.join(', ')}</td>
                    <td className="px-4 py-2">{step.values.join(', ')}</td>
                    <td className="px-4 py-2 capitalize">
                      {step.action === 'found' ? (
                        <span className="font-bold text-green-600 dark:text-green-400">Found!</span>
                      ) : step.action === 'swap' ? (
                        <span className="font-bold text-purple-600 dark:text-purple-400">Swapped</span>
                      ) : step.action === 'merge' ? (
                        <span className="font-bold text-blue-600 dark:text-blue-400">Merged</span>
                      ) : (
                        step.action
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
        <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Algorithm Explanation
          </h2>
          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {algorithm === 'linear' ? (
              <>
                <p className="mb-3"><strong className="text-blue-500">Linear Search</strong> is a simple searching algorithm that checks each element in the array sequentially until it finds the target value.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Advantages:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Works on both sorted and unsorted arrays</li>
                      <li>Simple to implement</li>
                      <li>No preprocessing needed</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Complexity:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Time:</strong> O(n) - checks each element once in worst case</li>
                      <li><strong>Space:</strong> O(1) - uses constant space</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : algorithm === 'binary' ? (
              <>
                <p className="mb-3"><strong className="text-blue-500">Binary Search</strong> is an efficient algorithm for finding an item in a sorted array by repeatedly dividing the search interval in half.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Advantages:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Much faster than linear search for large arrays</li>
                      <li>Efficient for sorted data</li>
                      <li>Works well for static datasets</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Complexity:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Time:</strong> O(log n) - halves search space each iteration</li>
                      <li><strong>Space:</strong> O(1) - uses constant space</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : algorithm === 'bubble' ? (
              <>
                <p className="mb-3"><strong className="text-blue-500">Bubble Sort</strong> repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Characteristics:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Simple to understand and implement</li>
                      <li>Inefficient for large datasets</li>
                      <li>Stable sorting algorithm</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Complexity:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Time (Worst):</strong> O(n²)</li>
                      <li><strong>Time (Best):</strong> O(n) when array is already sorted</li>
                      <li><strong>Space:</strong> O(1)</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : algorithm === 'selection' ? (
              <>
                <p className="mb-3"><strong className="text-blue-500">Selection Sort</strong> divides the input list into two parts: a sorted sublist and an unsorted sublist, and repeatedly selects the smallest element from the unsorted sublist.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Characteristics:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Simple implementation</li>
                      <li>Performs well on small lists</li>
                      <li>Not stable (may change order of equal elements)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Complexity:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Time:</strong> O(n²) in all cases</li>
                      <li><strong>Space:</strong> O(1)</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : algorithm === 'insertion' ? (
              <>
                <p className="mb-3"><strong className="text-blue-500">Insertion Sort</strong> builds the final sorted array one item at a time by repeatedly taking the next item and inserting it into the correct position.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Characteristics:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Efficient for small data sets</li>
                      <li>Stable sorting algorithm</li>
                      <li>Adaptive (efficient for mostly sorted data)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Complexity:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Time (Worst):</strong> O(n²)</li>
                      <li><strong>Time (Best):</strong> O(n) when array is already sorted</li>
                      <li><strong>Space:</strong> O(1)</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : algorithm === 'merge' ? (
              <>
                <p className="mb-3"><strong className="text-blue-500">Merge Sort</strong> is a divide-and-conquer algorithm that divides the input array into two halves, sorts them recursively, and then merges the two sorted halves.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Characteristics:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Stable sorting algorithm</li>
                      <li>Well-suited for large datasets</li>
                      <li>Excellent for linked lists</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Complexity:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Time:</strong> O(n log n) in all cases</li>
                      <li><strong>Space:</strong> O(n) auxiliary space</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : algorithm === 'quick' ? (
              <>
                <p className="mb-3"><strong className="text-blue-500">Quick Sort</strong> is a divide-and-conquer algorithm that selects a 'pivot' element and partitions the array around the pivot, placing smaller elements before it and larger elements after it.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Characteristics:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Generally the fastest sorting algorithm in practice</li>
                      <li>Not stable (may change order of equal elements)</li>
                      <li>Works well with cache memory</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Complexity:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Time (Avg):</strong> O(n log n)</li>
                      <li><strong>Time (Worst):</strong> O(n²) when poorly partitioned</li>
                      <li><strong>Space:</strong> O(log n) stack space</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSVisualizer;