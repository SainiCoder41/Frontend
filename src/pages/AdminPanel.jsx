import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaPlusCircle, FaEdit, FaTrashAlt, FaCode, FaPlus } from 'react-icons/fa';
import {Video} from 'lucide-react'
import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';

const AdminPanel = () => {
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [problems, setProblems] = useState();
  
  const adminCards = [
    {
      id: 1,
      title: "Create Problem",
      description: "Add new coding challenges to the platform",
      icon: <FaPlusCircle className="text-blue-500 dark:text-blue-400 text-3xl" />,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      buttonColor: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
      glowColor: "hover:shadow-blue-500/20 dark:hover:shadow-blue-400/30",
      path: "/admin/create-problem",
    },
    {
      id: 2,
      title: "Update Problem",
      description: "Modify existing coding challenges",
      icon: <FaEdit className="text-yellow-500 dark:text-yellow-400 text-3xl" />,
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-600",
      glowColor: "hover:shadow-yellow-500/20 dark:hover:shadow-yellow-400/30",
      path: "/admin/update-problem",
    },
    {
      id: 3,
      title: "Delete Problem",
      description: "Remove coding challenges from platform",
      icon: <FaTrashAlt className="text-red-500 dark:text-red-400 text-3xl" />,
      bgColor: "bg-red-100 dark:bg-red-900/30",
      buttonColor: "bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600",
      glowColor: "hover:shadow-red-500/20 dark:hover:shadow-red-400/30",
      path: "/admin/delete-problem",
    },
    {
      id: 4,
      title: "Create Contest",
      description: "Create Contest for Coding",
      icon: <FaPlus className="text-green-500 dark:text-green-400 text-3xl" />,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      buttonColor: "bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600",
      glowColor: "hover:shadow-green-500/20 dark:hover:shadow-green-400/30",
      path: "/admin/create-contest",
    },
     {
  id: 5,
  title: "Video Problem",
  description: "Upload, Manage & Delete Videos",
  icon: <Video className="text-green-500 dark:text-green-400 text-3xl" />,
  bgColor: "bg-green-50/80 dark:bg-green-900/20",
  borderColor: "border-green-200 dark:border-green-800/50",
  buttonColor: "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600",
  textColor: "text-green-800 dark:text-green-200",
  glowColor: "hover:shadow-green-400/30 dark:hover:shadow-green-500/20",
  hoverEffect: "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
  path: "/admin/video-management",
  badge: {
    text: "New",
    color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
  },
  features: [
    "MP4 uploads",
    "Thumbnail generation",
    "Video transcoding",
    "Metadata editing"
  ]
}
 
  ];

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (err) {
        alert("Error:" + err.message);
      }
    };
    fetchProblems();
  }, []);

  const statsData = [
    { 
      label: "Total Problems", 
      value: problems?.length, 
      color: "text-blue-600 dark:text-blue-400", 
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500 dark:text-blue-300"
    },
    { 
      label: "Active Users", 
      value: user?.firstName, 
      color: "text-green-600 dark:text-green-400", 
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-500 dark:text-green-300"
    },
  
  ];

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? 
      "bg-gradient-to-br from-gray-900 to-gray-800" : 
      "bg-gradient-to-br from-gray-50 to-gray-100"}`}
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className={`text-3xl font-bold flex items-center gap-2 transition-colors duration-300 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}>
            <FaCode className={`text-blue-600 ${darkMode ? "animate-pulse" : ""}`} /> 
            Admin Dashboard
          </h1>
          <p className={`mt-2 transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Manage coding problems and platform content
          </p>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => (
            <NavLink
              key={card.id}
              to={card.path}
              className={`rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 border ${
                darkMode ? 
                "border-gray-700 hover:shadow-lg hover:shadow-blue-500/10" : 
                "border-gray-200 hover:shadow-lg"
              } ${card.glowColor} relative group`}
            >
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 h-full flex flex-col items-center text-center`}>
                <div className={`${card.bgColor} p-4 rounded-full mb-4 transition-all duration-300 group-hover:scale-110`}>
                  {card.icon}
                </div>
                <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}>
                  {card.title}
                </h2>
                <p className={`mb-4 transition-colors duration-300 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  {card.description}
                </p>
                <div className="mt-auto w-full">
                  <button className={`${card.buttonColor} text-white px-4 py-2 rounded-lg transition-all duration-300 w-full group-hover:shadow-md ${
                    darkMode ? "group-hover:shadow-white/10" : "group-hover:shadow-black/10"
                  }`}>
                    {card.id === 1 ? "Create New" : card.id === 2 ? "Edit Problems" : "Manage Problems"}
                  </button>
                </div>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Stats Section */}
        <div className={`mt-12 rounded-xl shadow-md p-6 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
        }`}>
          <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}>
            Platform Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsData.map((stat, index) => (
              <div 
                key={index} 
                className={`${stat.bgColor} p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] border ${
                  darkMode ? "border-gray-700" : "border-transparent"
                }`}
              >
                <p className={`${stat.color} font-medium flex items-center gap-2`}>
                  <span className={`text-lg ${stat.iconColor}`}>•</span>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold mt-2 ${
                  darkMode ? "text-green" : "text-gray-800"
                }`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;