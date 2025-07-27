import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router-dom';
import { FiUpload, FiTrash2, FiVideo, FiEdit2, FiLoader } from 'react-icons/fi';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video problem?')) return;
    
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete problem');
      console.error(err);
    }
  };

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-primary dark:text-primary-400 mx-auto mb-4" />
          <p className="text-lg dark:text-gray-300">Loading video problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error shadow-lg dark:bg-red-900/80 dark:text-red-100">
          <div>
            <FaTimesCircle className="text-xl" />
            <span>{error}</span>
          </div>
          <button 
            className="btn btn-sm btn-ghost dark:text-red-100"
            onClick={fetchProblems}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-2">
            <FiVideo className="text-green-500" />
            Video Problem Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload, manage, and delete video problems
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <input
              type="text"
              placeholder="Search problems..."
              className="input input-bordered w-full pl-10 dark:bg-gray-800 dark:border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="w-12 text-gray-600 dark:text-gray-300">#</th>
                <th className="text-gray-600 dark:text-gray-300">Title</th>
                <th className="text-gray-600 dark:text-gray-300">Difficulty</th>
                <th className="text-gray-600 dark:text-gray-300">Tags</th>
                <th className="text-gray-600 dark:text-gray-300">Status</th>
                <th className="text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, index) => (
                  <tr key={problem._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="font-medium text-gray-700 dark:text-gray-300">{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <FiVideo className="text-green-500 text-lg" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium dark:text-white">{problem.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">ID: {problem._id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-lg ${
                        problem.difficulty === 'Easy' 
                          ? 'badge-success bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : problem.difficulty === 'Medium' 
                            ? 'badge-warning bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'badge-error bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.split(',').map((tag, i) => (
                          <span 
                            key={i} 
                            className="badge badge-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <FaCheckCircle className="text-green-500" />
                        <span className="dark:text-gray-300">Active</span>
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <NavLink
                          to={`/admin/upload/${problem._id}`}
                          className="btn btn-sm btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 gap-1"
                        >
                          <FiUpload size={14} />
                          Upload
                        </NavLink>
                        <button
                          onClick={() => handleDelete(problem._id)}
                          className="btn btn-sm btn-error dark:bg-red-600 dark:hover:bg-red-700 gap-1"
                        >
                          <FiTrash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                      <FiVideo className="text-4xl" />
                      <p className="text-lg">No video problems found</p>
                      {searchTerm && (
                        <button 
                          className="btn btn-sm btn-ghost mt-2"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVideo;