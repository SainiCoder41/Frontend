import { useEffect, useState } from 'react';
import { FiSearch, FiList, FiBookmark, FiCheckCircle, FiClock } from 'react-icons/fi';
import { FaRegCircle, FaCheckCircle, FaCrown } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import { Lock, CheckCircle2,Sparkles, Moon,ArrowRight, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleDarkMode } from '../store/themeSlice';


const HomePage = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const darkMode = useSelector((state) => state.theme.darkMode);
    const dispatch = useDispatch();
    const [problems, setProblems] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        difficulty: 'all',
        tags: 'all'
    });
    const [solvedProblems, setSolvedProblems] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 10;

    // Fetch all problems
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/getAllProblem');
                setProblems(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching problems:", err);
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    // Fetch solved problems and calculate statistics
    useEffect(() => {
        const fetchSolvedProblems = async () => {
            if (!isAuthenticated) return;
            
            try {
                const { data } = await axiosClient.get('/problem/problemSolvedByUser');
                const solvedIds = new Set(data);
                setSolvedProblems(solvedIds);
                
                const solved = problems.filter(p => solvedIds.has(p._id));
                const easySolved = solved.filter(p => p.difficulty === 'easy').length;
                const mediumSolved = solved.filter(p => p.difficulty === 'medium').length;
                const hardSolved = solved.filter(p => p.difficulty === 'hard').length;
                
                setStats({
                    totalSolved: solved.length,
                    easySolved,
                    mediumSolved,
                    hardSolved
                });
            } catch (err) {
                console.error("Error fetching solved problems:", err);
            }
        };
        
        if (problems.length > 0) {
            fetchSolvedProblems();
        }
    }, [isAuthenticated, problems]);

    const filteredProblems = problems.filter(problem => {
        const difficultyMatch = filters.difficulty === 'all' || 
                              problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
        const tagMatch = filters.tags === 'all' || 
                        problem.tags.toLowerCase().includes(filters.tags.toLowerCase());
        const searchMatch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          problem.tags.toLowerCase().includes(searchQuery.toLowerCase());
        
        return difficultyMatch && tagMatch && searchMatch;
    });

    // Pagination logic
    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);
    const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleLogOut = () => {
        dispatch(logoutUser());
    };

    const toggleTheme = () => {
        dispatch(toggleDarkMode());
    };

    if (loading) {
        return (
            <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-gray-50'}`}>
                {/* Loading skeleton */}
                 {/* Header Skeleton */}
      <div className="animate-pulse mb-8">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100 animate-pulse">
        <div className="p-6">
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-gray-50'}`}>
            {/* Glowing orb decoration */}
            <div className={`fixed -top-20 -right-20 w-64 h-64 rounded-full filter blur-3xl opacity-20 pointer-events-none ${darkMode ? 'bg-indigo-600' : 'bg-blue-400'}`}></div>
            <div className={`fixed bottom-0 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-10 pointer-events-none ${darkMode ? 'bg-purple-600' : 'bg-indigo-300'}`}></div>

            {/* Header */}
            <header className={`sticky top-0 z-50 backdrop-blur-md ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} border-b transition-colors duration-500`}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <motion.h1 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-2xl font-bold bg-clip-text ${darkMode ? 'text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400' : 'text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'}`}
                        >
                           Codex
                        </motion.h1>
                        <nav className="hidden md:flex space-x-6">
                            <NavLink 
                                
                                className={({ isActive }) => 
                                    `transition-colors duration-200 font-medium ${isActive ? 
                                        (darkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400' : 'text-blue-600') : 
                                        (darkMode ? 'text-gray-400 hover:text-green-300' : 'text-gray-600 hover:text-blue-600')}`
                                }
                            >
                                Problems
                            </NavLink>
                            <NavLink 
                                to="/contest" 
                                className={({ isActive }) => 
                                    `transition-colors duration-200 font-medium ${isActive ? 
                                        (darkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400' : 'text-blue-600') : 
                                        (darkMode ? 'text-gray-400 hover:text-green-300' : 'text-gray-600 hover:text-blue-600')}`
                                }
                            >
                                Contest
                            </NavLink>
                            <NavLink 
                                to="/visualizer" 
                                className={({ isActive }) => 
                                    `transition-colors duration-200 font-medium ${isActive ? 
                                        (darkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400' : 'text-blue-600') : 
                                        (darkMode ? 'text-gray-400 hover:text-green-300' : 'text-gray-600 hover:text-blue-600')}`
                                }
                            >
                                Visualizer
                            </NavLink>
                            
                            <NavLink to="/leaderboard"  
                              className={({ isActive }) => 
                                    `transition-colors duration-200 font-medium ${isActive ? 
                                        (darkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400' : 'text-blue-600') : 
                                        (darkMode ? 'text-gray-400 hover:text-green-300' : 'text-gray-600 hover:text-blue-600')}`
                                }>
                                LeaderBoard
                            </NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-all ${darkMode ? 'text-amber-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-200/50'}`}
                            aria-label="Toggle theme"
                        >
                            {darkMode ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {isAuthenticated && user?.role === 'admin' && (
                            <NavLink to="/admin">
                                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center group">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                    Admin
                                </button>
                            </NavLink>
                        )}

                      {user ? (
  <div className="dropdown dropdown-end">
    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
      <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} text-white flex items-center justify-center font-mono font-bold tracking-wider relative`}>
        <span className='absolute top-2.5 left-4'>
          {user.firstName.charAt(0).toUpperCase()}
        </span>
      </div>
    </label>
    <ul tabIndex={0} className={`mt-3 p-2 shadow menu menu-sm dropdown-content rounded-box w-72 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
      {/* Profile Header */}
      <li>
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} text-white flex items-center justify-center font-mono font-bold text-xl`}>
              {user.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.firstName}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.emailId}</p>
            </div>
          </div>
        </div>
      </li>
      
      <li><hr className={`my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} /></li>
      
      {/* Coding Stats (LeetCode Style) */}
      <li className="px-4 py-2">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{solvedProblems.size}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Solved</p>
          </div>
          <div>
            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Beginner</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Level</p>
          </div>
          <div>
            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>87%</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy</p>
          </div>
        </div>
      </li>
      

      
      <li><hr className={`my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} /></li>
      
      {/* Menu Items */}
      <li>
        <a className={`flex items-center ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-blue-50 hover:text-blue-600'}`}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </a>
      </li>
      <li>
        <a className={`flex items-center ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-blue-50 hover:text-blue-600'}`}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </a>
      </li>
      <li>
        <a className={`flex items-center ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-blue-50 hover:text-blue-600'}`}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Badges
        </a>
      </li>
      <li onClick={handleLogOut}>
        <a className={`flex items-center ${darkMode ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-50 hover:text-red-600'}`}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </a>
      </li>
    </ul>
  </div>
) : (
  <>
    <NavLink to="/login">
      <button className={`px-4 py-2 rounded-md border transition-colors duration-300 ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
        Login
      </button>
    </NavLink>
    <NavLink to="/signup">
      <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:shadow-lg transition-all duration-300 shadow-md font-medium hover:from-orange-600 hover:to-orange-700">
        Sign Up
      </button>
    </NavLink>
  </>
)}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                {/* Problem List Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                        >
                            Coding Challenges
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                            Sharpen your skills with our curated problem sets
                        </motion.p>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                        <div className="relative flex-grow max-w-md">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                <FiSearch />
                            </div>
                            <input
                                type="text"
                                placeholder="Search problems..."
                                className={`pl-10 pr-4 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-500 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 placeholder-gray-400 border'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex space-x-2">
                            <select
                                className={`px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 border'} ${filters.difficulty !== 'all' ? (darkMode ? 'bg-indigo-900/30 text-indigo-200 border-indigo-700' : 'bg-blue-50 text-blue-700 border-blue-200') : ''}`}
                                value={filters.difficulty}
                                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                            >
                                <option value="all">All Difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                            <select
                                className={`px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 border'} ${filters.tags !== 'all' ? (darkMode ? 'bg-indigo-900/30 text-indigo-200 border-indigo-700' : 'bg-blue-50 text-blue-700 border-blue-200') : ''}`}
                                value={filters.tags}
                                onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
                            >
                                <option value="all">All Tags</option>
                                <option value="array">Array</option>
                                <option value="linked-list">Linked List</option>
                                <option value="binary-tree">Binary Tree</option>
                            </select>
<NavLink to="/premium">
  <button
    className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 overflow-hidden
      ${
        user?.premium
          ? darkMode
            ? "bg-emerald-900/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900/40 hover:shadow-emerald-500/10"
            : "bg-emerald-100/80 text-emerald-700 border border-emerald-300 hover:bg-emerald-200/80 hover:shadow-emerald-300/20"
          : darkMode
          ? "bg-gradient-to-br from-amber-500 via-amber-600 to-blue-600 text-white hover:shadow-lg hover:shadow-amber-500/30 hover:brightness-110"
          : "bg-gradient-to-br from-amber-400 via-amber-500 to-red-500 text-white hover:shadow-lg hover:shadow-amber-400/40 hover:brightness-105"
      }
      shadow-md hover:scale-[1.02] active:scale-95`}
  >
    {/* Premium glow effect */}
    {!user?.premium && (
      <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    )}
    
    {user?.premium ? (
      <>
        <CheckCircle2
          className={`w-5 h-5 ${
            darkMode ? "text-emerald-300" : "text-emerald-500"
          } group-hover:scale-110 transition-transform`}
        />
        <span>Premium Member</span>
        <Sparkles
          className={`w-4 h-4 ${
            darkMode ? "text-yellow-300" : "text-yellow-500"
          } opacity-0 group-hover:opacity-100 transition-all duration-300`}
        />
      </>
    ) : (
      <>
        <FaCrown className="text-white group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
        <span>Upgrade Now</span>
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      </>
    )}
  </button>
</NavLink>

                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Total Solved Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-gray-800/50 border border-gray-700 hover:border-indigo-500/30' : 'bg-white border border-gray-200 hover:border-blue-200'}`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Solved</h3>
                            <FiCheckCircle className={`text-xl ${darkMode ? 'text-indigo-400' : 'text-green-500'}`} />
                        </div>
                        <div className="mt-4">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{solvedProblems.size}</p>
                            <div className={`w-full rounded-full h-2 mt-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div 
                                    className={`h-2 rounded-full ${darkMode ? 'bg-gradient-to-r from-indigo-400 to-purple-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'}`} 
                                    style={{ width: `${(solvedProblems.size / problems.length) * 100}%` }}
                                ></div>
                            </div>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {Math.round((solvedProblems.size / problems.length) * 100)}% of all problems
                            </p>
                        </div>
                    </motion.div>

                    {/* Easy Solved Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-gray-800/50 border border-gray-700 hover:border-green-500/30' : 'bg-white border border-gray-200 hover:border-green-200'}`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Easy Solved</h3>
                            <FiCheckCircle className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                        </div>
                        <div className="mt-4">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.easySolved}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Easy problems</p>
                        </div>
                    </motion.div>

                    {/* Medium Solved Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-gray-800/50 border border-gray-700 hover:border-yellow-500/30' : 'bg-white border border-gray-200 hover:border-yellow-200'}`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Medium Solved</h3>
                            <FiCheckCircle className={`text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                        </div>
                        <div className="mt-4">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.mediumSolved}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Medium problems</p>
                        </div>
                    </motion.div>

                    {/* Hard Solved Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-gray-800/50 border border-gray-700 hover:border-red-500/30' : 'bg-white border border-gray-200 hover:border-red-200'}`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hard Solved</h3>
                            <FiCheckCircle className={`text-xl ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                        </div>
                        <div className="mt-4">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.hardSolved}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hard problems</p>
                        </div>
                    </motion.div>
                </div>

                {/* Problem List Table */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className={`rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                                <tr>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                        #
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Title
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Difficulty
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Tags
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {currentProblems.map((problem, index) => (
                                    <motion.tr 
                                        key={problem._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className={`transition-colors duration-150 ${darkMode ? 'hover:bg-gray-700/70' : 'hover:bg-blue-50'}`}
                                    >
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {indexOfFirstProblem + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <NavLink 
                                                    to="/problem" 
                                                    state={{ id: problem._id }}
                                                    className={`text-sm font-medium transition-colors duration-200 flex items-center ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-blue-600 hover:text-blue-800'}`}
                                                >
                                                    {problem.title}
                                                    {problem.premium && (
                                                        <FaCrown className="ml-2 text-yellow-500" />
                                                    )}
                                                </NavLink>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                problem.difficulty === 'easy' ? 
                                                    (darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800') :
                                                problem.difficulty === 'medium' ? 
                                                    (darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800') :
                                                    (darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800')
                                            }`}>
                                                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {problem.tags.split(',').map((tag, index) => (
                                                    <span 
                                                        key={index} 
                                                        className={`text-xs px-2.5 py-1 rounded-full transition-colors duration-200 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {problem.premium && !user?.premium ? (
                                                <div className="flex items-center justify-end gap-1.5 cursor-not-allowed">
                                                    <Lock size={20} className={darkMode ? "text-yellow-500" : "text-yellow-600"} />
                                                    <span className={darkMode ? "text-yellow-500" : "text-yellow-600"}>Premium</span>
                                                </div>
                                            ) : (
                                                <NavLink 
                                                    to="/problem" 
                                                    state={{ id: problem._id }} 
                                                    className="flex items-center justify-end gap-1.5"
                                                >
                                                    {solvedProblems.has(problem._id) ? (
                                                        <>
                                                            <FaCheckCircle className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                                                            <span className={darkMode ? "text-green-400" : "text-green-600"}>Solved</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg 
                                                                xmlns="http://www.w3.org/2000/svg" 
                                                                className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-blue-500'}`} 
                                                                fill="none" 
                                                                viewBox="0 0 24 24" 
                                                                stroke="currentColor"
                                                            >
                                                                <path 
                                                                    strokeLinecap="round" 
                                                                    strokeLinejoin="round" 
                                                                    strokeWidth={2} 
                                                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                                                                />
                                                            </svg>
                                                            <span className={darkMode ? "text-indigo-400" : "text-blue-600"}>Ready</span>
                                                        </>
                                                    )}
                                                </NavLink>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredProblems.length > problemsPerPage && (
                        <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${currentPage === 1 ? 
                                        (darkMode ? 'bg-gray-800 text-gray-500 border-gray-700' : 'bg-gray-100 text-gray-400 border-gray-300') : 
                                        (darkMode ? 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${currentPage === totalPages ? 
                                        (darkMode ? 'bg-gray-800 text-gray-500 border-gray-700' : 'bg-gray-100 text-gray-400 border-gray-300') : 
                                        (darkMode ? 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                                        Showing <span className="font-medium">{indexOfFirstProblem + 1}</span> to{' '}
                                        <span className="font-medium">
                                            {Math.min(indexOfLastProblem, filteredProblems.length)}
                                        </span>{' '}
                                        of <span className="font-medium">{filteredProblems.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} ${currentPage === 1 ? 
                                                (darkMode ? 'text-gray-600' : 'text-gray-300') : 
                                                (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50')}`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        
                                        {/* Page numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                            <button
                                                key={number}
                                                onClick={() => paginate(number)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${darkMode ? 'border-gray-600' : 'border-gray-300'} ${currentPage === number ? 
                                                    (darkMode ? 'z-10 bg-indigo-900/50 border-indigo-500 text-indigo-300' : 'z-10 bg-blue-50 border-blue-500 text-blue-600') : 
                                                    (darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-50')}`}
                                            >
                                                {number}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} ${currentPage === totalPages ? 
                                                (darkMode ? 'text-gray-600' : 'text-gray-300') : 
                                                (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50')}`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>

            {/* Footer */}
            <footer className={`mt-12 ${darkMode ? 'bg-gray-900/80 border-t border-gray-800' : 'bg-white border-t border-gray-200'} transition-colors duration-500`}>
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Codex</h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                The ultimate platform to help you enhance your skills, expand your knowledge, and prepare for technical interviews.
                            </p>
                        </div>
                        <div>
                            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Resources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-blue-600'}`}>Articles</a></li>
                                <li><a href="#" className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-blue-600'}`}>Problems</a></li>
                                <li><a href="#" className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-blue-600'}`}>Challenges</a></li>
                                <li><a href="#" className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-blue-600'}`}>Interview Prep</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-blue-600'}`}>About</a></li>
                                <li><a href="#" className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-blue-600'}`}>Careers</a></li>
                                <li><a href="#" className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-blue-600'}`}>Privacy Policy</a></li>
                                <li><a href="#" className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-blue-600'}`}>Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Connect With Us</h4>
                            <div className="flex space-x-6">
                                <a href="#" className={`transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-blue-500'}`}>
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className={`transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-blue-400'}`}>
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className={`transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-gray-600'}`}>
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} text-center`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            &copy; {new Date().getFullYear()} LeetCode Premium. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;