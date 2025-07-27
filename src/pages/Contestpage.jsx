import React, { useEffect, useState } from 'react';
import { 
  FiClock, FiAward, FiCalendar, FiUser, FiStar, 
  FiZap, FiTrendingUp, FiFlag, FiLock, FiTag,
  FiChevronRight
} from 'react-icons/fi';
import { GiLaurelsTrophy, GiPodiumWinner, GiTrophyCup } from 'react-icons/gi';
import { BsHourglassSplit, BsCalendarCheck, BsAwardFill, BsTrophy } from 'react-icons/bs';
import { FaMedal, FaCrown, FaCoins } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import contestImage from '../image/card.png';
import ContestWorkspace from '../Components/ContestWorkspace';

const Contestpage = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedProblemIds, setSelectedProblemIds] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axiosClient.get('/contest/getContest');
        setContests(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch contests');
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const getTimeUntilStart = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffMs = start - now;
    
    if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, text: "Started" };
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    let text = "";
    if (days > 0) {
      text = `${days}d ${hours}h`;
    } else if (hours > 0) {
      text = `${hours}h ${minutes}m`;
    } else {
      text = `${minutes}m`;
    }
    
    return { days, hours, minutes, text };
  };

  const fetchAndSelectProblems = async () => {
    try {
      const response = await axiosClient.get("/problem/getAllProblem");
      const allProblems = response.data || [];
      
      if (allProblems.length >= 2) {
        const shuffled = [...allProblems].sort(() => 0.5 - Math.random());
        setSelectedProblemIds(shuffled.slice(0, 2).map(p => p._id));
      } else {
        setError("Not enough problems in the database");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch problems");
    }
  };

  const handleParticipate = async (contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    
    if (now < start) {
      setError("Contest hasn't started yet");
      return;
    }
    
    await fetchAndSelectProblems();
    setSelectedContest(contest);
    setShowWorkspace(true);
  };

  const getFilteredContests = () => {
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return contests.filter(contest => new Date(contest.startTime) > now);
      case 'ongoing':
        return contests.filter(contest => 
          new Date(contest.startTime) <= now && new Date(contest.endTime) > now
        );
      default:
        return contests;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h left`;
  };

  const getTimePercentage = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    const total = end - start;
    const elapsed = now - start;
    
    if (now < start) return 0;
    if (now > end) return 100;
    return (elapsed / total) * 100;
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      easy: darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-800',
      medium: darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-800',
      hard: darkMode ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[difficulty.toLowerCase()] || (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')}`}>
        {difficulty}
      </span>
    );
  };

  const getPrizeIcon = (position) => {
    switch(position) {
      case 1: return <FaCrown className="text-yellow-400 mr-1" size={16} />;
      case 2: return <FaMedal className="text-gray-300 mr-1" size={16} />;
      case 3: return <FaMedal className="text-amber-500 mr-1" size={16} />;
      default: return <FaCoins className="text-blue-400 mr-1" size={14} />;
    }
  };

  const getContestStatus = (contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'ended';
  };

  if (loading) {
    return (
      <div className={`py-8 px-4 sm:px-6 lg:px-8 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mr-3 animate-pulse`}></div>
              <div>
                <div className={`h-8 w-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2 animate-pulse`}></div>
                <div className={`h-4 w-64 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className={`h-10 w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg animate-pulse`}></div>
              ))}
            </div>
          </div>

          {/* Skeleton Contest Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className={`rounded-xl shadow-sm overflow-hidden border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`h-40 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`h-6 w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
                    <div className={`h-6 w-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full animate-pulse`}></div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className={`h-4 w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
                    <div className={`h-4 w-5/6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
                  </div>
                  
                  <div className="space-y-2.5 mt-auto">
                    {[1, 2, 3, 4].map((line) => (
                      <div key={line} className="flex items-center">
                        <div className={`w-4 h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mr-2 animate-pulse`}></div>
                        <div className={`h-3 w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-6 w-full h-10 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg animate-pulse`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen text-center px-4 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <div className="max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold mb-2">Oops! Something went wrong</h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const filteredContests = getFilteredContests();
  
  if (filteredContests.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] text-center px-4 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <GiLaurelsTrophy className={`text-6xl mb-6 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          No contests available
        </h3>
        <p className={`max-w-md mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {filter === 'all' 
            ? "There are currently no contests scheduled. Check back later!"
            : filter === 'upcoming'
            ? "No upcoming contests at the moment."
            : "No contests are currently running."}
        </p>
        <button 
          onClick={() => setFilter('all')}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
        >
          View All Contests
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0.1,
              scale: 0.5
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className={`absolute rounded-full ${darkMode ? 'bg-indigo-900/30' : 'bg-blue-100/50'}`}
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              filter: 'blur(40px)'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium mb-4">
            <FiZap className="mr-2" /> Competitive Programming
          </div>
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Contests</span>
          </h1>
          <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Test your skills against top programmers and win amazing prizes in our competitive coding challenges.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="flex justify-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex rounded-xl p-1 bg-gray-200 dark:bg-gray-800">
            {[
              { value: 'all', icon: <FiTrendingUp />, label: 'All Contests' },
              { value: 'upcoming', icon: <FiClock />, label: 'Upcoming' },
              { value: 'ongoing', icon: <FiFlag />, label: 'Ongoing' }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-all ${
                  filter === f.value 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="mr-2">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredContests.map((contest) => {
              const status = getContestStatus(contest);
              const isEnded = status === 'ended';
              const timePercentage = getTimePercentage(contest.startTime, contest.endTime);
              const timeUntilStart = getTimeUntilStart(contest.startTime);
              
              return (
                <motion.div
                  key={contest._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:border-amber-500/30' 
                      : 'bg-white border border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {/* Contest Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={contestImage} 
                      alt={contest.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Ribbon */}
                    <div className={`absolute top-4 -right-10 w-40 transform rotate-45 px-4 py-1 text-center text-xs font-bold ${
                      status === 'ended' ? 'bg-gray-600 text-gray-200' :
                      status === 'upcoming' ? 'bg-blue-600 text-white' :
                      'bg-green-600 text-white'
                    }`}>
                      {status === 'ended' ? 'COMPLETED' : 
                       status === 'upcoming' ? 'UPCOMING' : 'LIVE NOW'}
                    </div>
                    
                    {/* Progress Bar */}
                    {!isEnded && (
                      <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div 
                          className={`h-full ${
                            status === 'upcoming' 
                              ? 'bg-blue-500' 
                              : 'bg-gradient-to-r from-green-400 to-emerald-500'
                          }`}
                          style={{ width: `${status === 'upcoming' ? 0 : timePercentage}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Contest Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className={`text-xl font-bold line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {contest.title}
                      </h2>
                      {getDifficultyBadge(contest.difficulty)}
                    </div>
                    
                    <p className={`mb-5 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {contest.description}
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className={`p-2 rounded-lg mr-3 ${
                          darkMode ? 'bg-gray-700 text-amber-400' : 'bg-amber-100 text-amber-600'
                        }`}>
                          <FiCalendar />
                        </div>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Starts</p>
                          <p className="text-sm font-medium">{formatDate(contest.startTime)}</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className={`p-2 rounded-lg mr-3 ${
                          darkMode ? 'bg-gray-700 text-amber-400' : 'bg-amber-100 text-amber-600'
                        }`}>
                          <BsCalendarCheck />
                        </div>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ends</p>
                          <p className="text-sm font-medium">{formatDate(contest.endTime)}</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className={`p-2 rounded-lg mr-3 ${
                          darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <FiAward />
                        </div>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type</p>
                          <p className="text-sm font-medium capitalize">{contest.contestType}</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className={`p-2 rounded-lg mr-3 ${
                          darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          <BsTrophy />
                        </div>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prize</p>
                          <p className="text-sm font-medium">
                            ${contest?.prizePool?.toLocaleString() || '500'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Time Status */}
                    <div className={`mb-6 p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {status === 'upcoming' ? 'Starts in:' : 
                           status === 'ongoing' ? 'Time remaining:' : 'Contest ended'}
                        </span>
                        <span className={`text-sm font-semibold ${
                          status === 'upcoming' ? 'text-blue-500' :
                          status === 'ongoing' ? 'text-green-500' : 'text-gray-500'
                        }`}>
                          {status === 'upcoming' ? timeUntilStart.text : 
                           status === 'ongoing' ? getTimeRemaining(contest.endTime) : 'Completed'}
                        </span>
                      </div>
                      {status !== 'ended' && (
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                          darkMode ? 'bg-gray-600' : 'bg-gray-300'
                        }`}>
                          <div 
                            className={`h-full ${
                              status === 'upcoming' ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${status === 'upcoming' ? '0%' : `${timePercentage}%`}` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Prizes Section */}
                    {contest.prizes?.length > 0 && (
                      <div className={`mb-6 p-4 rounded-lg ${
                        darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                      }`}>
                        <h4 className={`flex items-center font-medium mb-3 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          <GiPodiumWinner className={`mr-2 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                          <span>Top Prizes</span>
                        </h4>
                        <div className="space-y-3">
                          {contest.prizes.slice(0, 3).map((prize, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                {getPrizeIcon(prize.rank)}
                                <span className={`text-sm font-medium ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {prize.rank === 1 ? '1st Place' : 
                                   prize.rank === 2 ? '2nd Place' : 
                                   prize.rank === 3 ? '3rd Place' : `${prize.rank}th Place`}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className={`text-sm font-bold ${
                                  darkMode ? 'text-amber-400' : 'text-amber-600'
                                }`}>
                                  ${prize.amount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {isEnded ? (
                      <div className={`w-full py-3 rounded-xl cursor-not-allowed flex items-center justify-center font-medium ${
                        darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <FiUser className="mr-2" />
                        Contest Ended
                      </div>
                    ) : status === 'upcoming' ? (
                      <div className={`w-full py-3 rounded-xl flex items-center justify-center font-medium ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        <FiClock className="mr-2" />
                        Starts in {timeUntilStart.text}
                      </div>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleParticipate(contest)}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center font-medium shadow-md hover:shadow-lg"
                      >
                        <span>Participate Now</span>
                        <FiChevronRight className="ml-2" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Contest Workspace Modal */}
      {showWorkspace && selectedContest && selectedProblemIds.length > 0 && (
        <ContestWorkspace 
          problemIds={selectedProblemIds} 
          contest={selectedContest} 
          onClose={() => setShowWorkspace(false)}
        />
      )}
    </div>
  );
};

export default Contestpage;