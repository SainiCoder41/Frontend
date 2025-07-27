import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { FiTrash2, FiAlertTriangle, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { FaJava, FaJs } from 'react-icons/fa';
import { SiCplusplus } from 'react-icons/si';

// Enhanced color schemes
const difficultyColors = {
  easy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  hard: 'bg-rose-100 text-rose-800 border-rose-200'
};

const tagColors = {
  array: 'bg-blue-100 text-blue-800 border-blue-200',
  linkedList: 'bg-purple-100 text-purple-800 border-purple-200',
  graph: 'bg-teal-100 text-teal-800 border-teal-200',
  dp: 'bg-orange-100 text-orange-800 border-orange-200'
};

const languageIcons = {
  'c++': <SiCplusplus className="text-blue-500" />,
  java: <FaJava className="text-red-500" />,
  javascript: <FaJs className="text-yellow-500" />
};

export default function AdminDeletePanel() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch problems');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleDelete = async (problemId) => {
    try {
      await axiosClient.delete(`/problem/delete/${problemId}`);
      alert("Your Problem is Delete Successfully")
      setProblems(problems.filter(p => p._id !== problemId));
      setDeleteConfirm(null);
      setSelectedProblem(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete problem');
    }
  };

  const filteredProblems = problems.filter(problem => 
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
  return (
    <div className="p-4 space-y-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      
      {/* Search Bar Skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-10 bg-gray-200 rounded-md flex-grow"></div>
        <div className="h-10 bg-gray-200 rounded-md w-24"></div>
      </div>
      
      {/* Table Header Skeleton */}
      <div className="grid grid-cols-12 gap-4 mt-6">
        <div className="col-span-3 h-6 bg-gray-200 rounded"></div>
        <div className="col-span-3 h-6 bg-gray-200 rounded"></div>
        <div className="col-span-3 h-6 bg-gray-200 rounded"></div>
        <div className="col-span-3 h-6 bg-gray-200 rounded"></div>
      </div>
      
      {/* Table Rows Skeleton */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 items-center py-4 border-b">
          <div className="col-span-3 h-4 bg-gray-200 rounded"></div>
          <div className="col-span-3 h-4 bg-gray-200 rounded"></div>
          <div className="col-span-3 h-4 bg-gray-200 rounded"></div>
          <div className="col-span-3 flex justify-end gap-2">
            <div className="h-8 bg-gray-200 rounded-md w-16"></div>
            <div className="h-8 bg-gray-200 rounded-md w-16"></div>
          </div>
        </div>
      ))}
      
      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded-md w-8"></div>
          <div className="h-8 bg-gray-200 rounded-md w-8"></div>
          <div className="h-8 bg-gray-200 rounded-md w-8"></div>
        </div>
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="alert alert-error shadow-lg max-w-2xl mx-auto mt-8">
        <div>
          <FiAlertTriangle className="text-xl" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 shadow-sm border border-indigo-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FiTrash2 className="mr-2 text-rose-500" />
              Problem Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and delete coding problems</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search problems..."
                className="input input-bordered pl-10 w-full md:w-64 focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium border border-indigo-200">
              {problems.length} {problems.length === 1 ? 'Problem' : 'Problems'}
            </div>
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      {filteredProblems.length === 0 ? (
        <div className="card bg-white shadow-md p-8 text-center rounded-xl">
          <FiAlertTriangle className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No problems found</h3>
          <p className="text-gray-500">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <div 
              key={problem._id} 
              className={`card bg-white shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden border border-gray-100 
                ${selectedProblem?._id === problem._id ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => setSelectedProblem(problem)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{problem.title}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${tagColors[problem.tags]}`}>
                    {problem.tags}
                  </div>
                </div>
                
                <p className="text-gray-600 line-clamp-3 mb-6 text-sm">{problem.description?.substring(0, 150) || 'No description provided'}...</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {['c++', 'java', 'javascript'].map(lang => (
                      <div key={lang} className="tooltip" data-tip={lang}>
                        {languageIcons[lang]}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(problem._id);
                    }}
                    className="btn btn-error btn-outline btn-sm hover:bg-rose-100"
                  >
                    <FiTrash2 className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-rose-100 text-rose-500">
                <FiAlertTriangle className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{problems.find(p => p._id === deleteConfirm)?.title}"</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-ghost hover:bg-gray-100"
              >
                <FiX className="mr-1" />
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn btn-error hover:bg-rose-600"
              >
                <FiCheck className="mr-1" />
                Delete Problem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}