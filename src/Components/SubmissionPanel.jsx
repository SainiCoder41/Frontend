import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import {
  FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaClock, FaCode, FaMemory, FaStopwatch
} from 'react-icons/fa';
import { SiCplusplus, SiJavascript } from 'react-icons/si';

const SubmissionPanel = ({ id }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axiosClient.get(`/problem/submittedProblem/${id}`);
        setSubmissions(response.data.submissions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return { class: 'bg-green-100 text-green-800 border-green-200', icon: <FaCheckCircle className="text-green-500" />, text: 'Accepted' };
      case 'wrong':
        return { class: 'bg-red-100 text-red-800 border-red-200', icon: <FaTimesCircle className="text-red-500" />, text: 'Wrong Answer' };
      case 'error':
        return { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <FaExclamationTriangle className="text-yellow-500" />, text: 'Error' };
      case 'pending':
        return { class: 'bg-blue-100 text-blue-800 border-blue-200', icon: <FaClock className="text-blue-500" />, text: 'Pending' };
      default:
        return { class: 'bg-gray-100 text-gray-800 border-gray-200', icon: null, text: status };
    }
  };

  const getLanguageIcon = (language) => {
    switch (language) {
      case 'c++': return <SiCplusplus className="text-blue-500" />;
      case 'java': return <SiCplusplus className="text-red-500" />;
      case 'javascript': return <SiJavascript className="text-yellow-500" />;
      default: return <FaCode className="text-gray-500" />;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="alert alert-error shadow-lg">
      <div><FaTimesCircle className="text-xl" /><span>Error loading submissions: {error}</span></div>
    </div>
  );

  if (!submissions || submissions.length === 0) return (
    <div className="alert alert-warning shadow-lg">
      <div><FaExclamationTriangle className="text-xl" /><span>No submissions found</span></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {submissions.map((submission, index) => {
        const statusBadge = getStatusBadge(submission.status);
        const languageIcon = getLanguageIcon(submission.language);
        return (
          <div key={submission._id} className="card bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title text-2xl font-bold">Submission #{submission._id.slice(-6)}</h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`badge gap-2 ${statusBadge.class} border`}>
                      {statusBadge.icon} {statusBadge.text}
                    </span>
                    <span className="badge gap-2 bg-gray-100 text-gray-800 border-gray-200">
                      {languageIcon} {submission.language}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(submission.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="stat bg-gray-50 rounded-lg p-4">
                  <div className="stat-figure text-blue-500"><FaStopwatch /></div>
                  <div className="stat-title">Runtime</div>
                  <div className="stat-value text-lg">{submission.runtime ? `${submission.runtime}s` : 'N/A'}</div>
                </div>

                <div className="stat bg-gray-50 rounded-lg p-4">
                  <div className="stat-figure text-purple-500"><FaMemory /></div>
                  <div className="stat-title">Memory</div>
                  <div className="stat-value text-lg">{submission.memory ? `${submission.memory}KB` : 'N/A'}</div>
                </div>

                <div className="stat bg-gray-50 rounded-lg p-4">
                  <div className="stat-figure text-green-500"><FaCheckCircle /></div>
                  <div className="stat-title">Test Cases</div>
                  <div className="stat-value text-lg">
                    {submission.testCasesPassed}/{submission.testCasesTotal}
                  </div>
                  <div className="stat-desc">
                    {Math.round((submission.testCasesPassed / submission.testCasesTotal) * 100)}% passed
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Submitted Code</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <pre className="text-gray-200 overflow-x-auto"><code>{submission.code}</code></pre>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionPanel;
