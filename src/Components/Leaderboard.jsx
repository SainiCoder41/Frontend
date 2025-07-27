import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrophy, FaMedal, FaUser, FaLightbulb, FaCode, 
  FaChartLine, FaUsers, FaCrown, FaFire, FaStar 
} from 'react-icons/fa';
import { GiLaurelsTrophy, GiPodiumWinner } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { darkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosClient.get('/user/getAllUser');
        const sortedUsers = data
          .map((user, index) => ({
            ...user,
            uniqueKey: user.id || `user-${index}-${Date.now()}`,
            solvedCount: user.problemSolved?.length || 0,
            rank: index + 1,
            streak: Math.floor(Math.random() * 10), // Simulated streak
            points: Math.floor(Math.random() * 5000) + 1000 // Simulated points
          }))
          .sort((a, b) => b.solvedCount - a.solvedCount);
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <FaCrown className="text-yellow-400" size={20} />;
    if (index === 1) return <GiPodiumWinner className="text-gray-300" size={20} />;
    if (index === 2) return <GiPodiumWinner className="text-amber-500" size={20} />;
    return <FaUser className="text-blue-400" size={16} />;
  };

  const getRankBadge = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-400';
    if (index === 2) return 'bg-gradient-to-r from-amber-500 to-amber-600';
    return darkMode ? 'bg-gray-700' : 'bg-blue-100';
  };

  const filteredUsers = activeTab === 'top' ? users.slice(0, 10) : users;

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-4 mx-auto mb-4 ${
            darkMode ? 'border-blue-400' : 'border-blue-500'
          }`} />
          <h3 className={`text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading Leaderboard...
          </h3>
        </div>
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
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium mb-4">
            <FaFire className="mr-2" /> Competitive Leaderboard
          </div>
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            CodeX <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Rankings</span>
          </h1>
          <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            See where you stand among the best programmers on our platform
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`p-6 rounded-xl shadow-lg flex items-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className={`p-3 rounded-lg mr-4 ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <FaUsers className="text-2xl" />
            </div>
            <div>
              <h3 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Coders</h3>
              <p className={`${darkMode?"text-2xl font-bold text-white":"text-2xl font-bold"}`}>{users.length}+</p>
            </div>
          </div>
          
          <div className={`p-6 rounded-xl shadow-lg flex items-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className={`p-3 rounded-lg mr-4 ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
              <FaCode className="text-2xl" />
            </div>
            <div>
              <h3 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Problems Solved</h3>
              <p className={`${darkMode?"text-2xl font-bold text-white":"text-2xl font-bold"}`}>{users.reduce((sum, user) => sum + user.solvedCount, 0)}+</p>
            </div>
          </div>
          
          <div className={`p-6 rounded-xl shadow-lg flex items-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className={`p-3 rounded-lg mr-4 ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              <FaChartLine className="text-2xl" />
            </div>
            <div>
              <h3 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Daily Activity</h3>
              <p className={`${darkMode?"text-2xl font-bold text-white":"text-2xl font-bold"}`}>High</p>
            </div>
          </div>
          
          <div className={`p-6 rounded-xl shadow-lg flex items-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className={`p-3 rounded-lg mr-4 ${darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              <FaTrophy className="text-2xl" />
            </div>
            <div>
              <h3 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top Score</h3>
              <p className={`${darkMode?"text-2xl font-bold text-white":"text-2xl font-bold"}`}>{users[0]?.solvedCount || 0}</p>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className={`rounded-xl overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            {/* Header */}
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className={`text-2xl font-bold flex items-center mb-4 md:mb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <GiLaurelsTrophy className="mr-2 text-amber-500" /> 
                  Top Programmers
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'all' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                        : darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => setActiveTab('top')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'top' 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md' 
                        : darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Top 10
                  </button>
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className={`grid grid-cols-12 p-4 font-medium ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-5">User</div>
              <div className="col-span-3">Progress</div>
              <div className="col-span-1 text-center">Solved</div>
              <div className="col-span-1 text-center">Streak</div>
              <div className="col-span-1 text-center">Points</div>
            </div>

            {/* User Rows */}
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.uniqueKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`grid grid-cols-12 p-4 items-center border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex justify-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankBadge(index)}`}>
                      <span className={`font-bold ${index < 3 ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user.rank}
                      </span>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="col-span-5 font-medium flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} shadow-sm`}>
                      <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {user.firstName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        @{user.username || 'coder'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <div className={`w-full rounded-full h-2 mr-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (user.solvedCount / Math.max(1, users[0]?.solvedCount || 1)) * 100)}%` }}
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                            index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                            index === 2 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                            'bg-gradient-to-r from-blue-400 to-blue-500'
                          }`}
                        />
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {Math.round((user.solvedCount / Math.max(1, users[0]?.solvedCount || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Solved Count */}
                  <div className={`col-span-1 text-center font-bold ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    index === 2 ? 'text-amber-500' :
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {user.solvedCount}
                  </div>
                  
                  {/* Streak */}
                  <div className="col-span-1 text-center flex justify-center">
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.streak > 7 ? (darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600') :
                      user.streak > 3 ? (darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600') :
                      (darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600')
                    }`}>
                      <FaFire className="mr-1" size={12} />
                      {user.streak}
                    </div>
                  </div>
                  
                  {/* Points */}
                  <div className="col-span-1 text-center font-medium">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-600'
                    }`}>
                      <FaStar className="mr-1" size={10} />
                      {user.points.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Top 3 Winners Section */}
        {activeTab === 'all' && users.length >= 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <FaTrophy className="inline mr-2 text-amber-500" />
              Top Performers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              {users[1] && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-xl shadow-lg text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 bg-gradient-to-r from-gray-300 to-gray-400 shadow-md`}>
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <GiPodiumWinner className="absolute -top-2 -right-2 text-gray-300 text-3xl" />
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {users[1].firstName} {users[1].lastName}
                  </h3>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    @{users[1].username || 'silvercoder'}
                  </p>
                  <div className="flex justify-center space-x-4 mb-4">
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Solved</p>
                      <p className="font-bold text-gray-400">{users[1].solvedCount}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Streak</p>
                      <p className="font-bold text-orange-500">{users[1].streak}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Points</p>
                      <p className="font-bold text-purple-500">{users[1].points.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* 1st Place */}
              {users[0] && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-xl shadow-lg text-center transform -translate-y-4 ${darkMode ? 'bg-gray-800 border-2 border-amber-500/50' : 'bg-white border-2 border-amber-400/50'}`}
                  style={{ boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.3)' }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg`}>
                        <span className="text-3xl font-bold text-white">1</span>
                      </div>
                      <FaCrown className="absolute -top-3 -right-3 text-yellow-400 text-4xl" />
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {users[0].firstName} {users[0].lastName}
                  </h3>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    @{users[0].username || 'champion'}
                  </p>
                  <div className="flex justify-center space-x-4 mb-4">
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Solved</p>
                      <p className="font-bold text-yellow-500">{users[0].solvedCount}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Streak</p>
                      <p className="font-bold text-red-500">{users[0].streak}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Points</p>
                      <p className="font-bold text-purple-500">{users[0].points.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* 3rd Place */}
              {users[2] && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-xl shadow-lg text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 bg-gradient-to-r from-amber-500 to-amber-600 shadow-md`}>
                        <span className="text-2xl font-bold text-white">3</span>
                      </div>
                      <GiPodiumWinner className="absolute -top-2 -right-2 text-amber-500 text-3xl" />
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {users[2].firstName} {users[2].lastName}
                  </h3>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    @{users[2].username || 'bronzecoder'}
                  </p>
                  <div className="flex justify-center space-x-4 mb-4">
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Solved</p>
                      <p className="font-bold text-amber-500">{users[2].solvedCount}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Streak</p>
                      <p className="font-bold text-orange-500">{users[2].streak}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Points</p>
                      <p className="font-bold text-purple-500">{users[2].points.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-8 rounded-xl text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg`}
        >
          <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to climb the leaderboard?
          </h2>
          <p className={`max-w-2xl mx-auto mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Solve coding challenges, improve your skills, and compete with programmers from around the world.
          </p>
          <NavLink to="/home">
 <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium">
            Start Coding Now
          </button>
          </NavLink>
         
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;