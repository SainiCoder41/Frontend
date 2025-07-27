import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiSearch, FiEdit, FiSave, FiTrash2, FiPlus, FiArrowLeft,
  FiCpu, FiUnlock, FiLock 
} from 'react-icons/fi';
import { FaJava, FaJs } from 'react-icons/fa';
import { SiCplusplus } from 'react-icons/si';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['c++', 'java', 'javascript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).min(1, 'At least one language required'), // Changed from .length(3)
  referenceSolution: z.array(
    z.object({
      language: z.enum(['c++', 'java', 'javascript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).min(1, 'At least one language required') // Changed from .length(3)
});

const languageOptions = [
  { value: 'c++', label: 'c++', icon: <SiCplusplus className="text-blue-500" /> },
  { value: 'java', label: 'java', icon: <FaJava className="text-red-500" /> },
  { value: 'javascript', label: 'javascript', icon: <FaJs className="text-yellow-500" /> }
];

function AdminUpdatePanel() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [searchId, setSearchId] = useState('');
  const [problem, setProblem] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: languageOptions.map(lang => ({
        language: lang.value,
        initialCode: ''
      })),
      referenceSolution: languageOptions.map(lang => ({
        language: lang.value,
        completeCode: ''
      }))
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const {
    fields: startCodeFields,
  } = useFieldArray({
    control,
    name: 'startCode'
  });

  const {
    fields: referenceSolutionFields,
  } = useFieldArray({
    control,
    name: 'referenceSolution'
  });

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setSearchError('Please enter a problem ID');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    try {
      const response = await axiosClient.get(`/problem/problemById/${searchId}`);
      if (response.data) {
        setProblem(response.data);
        
        const formattedData = {
          title: response.data.title,
          description: response.data.description,
          difficulty: response.data.difficulty,
          tags: response.data.tags,
          visibleTestCases: response.data.visibleTestCases,
          hiddenTestCases: response.data.hiddenTestCases,
          startCode: languageOptions.map(lang => ({
            language: lang.value,
            initialCode: response.data.startCode.find(sc => sc.language === lang.value)?.initialCode || ''
          })),
          referenceSolution: languageOptions.map(lang => ({
            language: lang.value,
            completeCode: response.data.referenceSolution.find(rs => rs.language === lang.value)?.completeCode || ''
          }))
        };

        reset(formattedData);
      } else {
        setSearchError('Problem not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error.response?.data?.message || 'Failed to fetch problem');
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = async (data) => {
    console.log('Form submission triggered with data:', data);
    if (!problem) return;

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const payload = {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        tags: data.tags,
        visibleTestCases: data.visibleTestCases,
        hiddenTestCases: data.hiddenTestCases,
        startCode: data.startCode,
        referenceSolution: data.referenceSolution,
        problemCreator: user._id
      };
      
      const response = await axiosClient.put(`/problem/update/${problem._id}`, payload);
      
      if (response.status === 200) {
        alert('Problem updated successfully!');
        navigate('/admin');
      } else {
        throw new Error(response.data?.message || 'Failed to update problem');
      }
    } catch (error) {
      console.error('Update error:', error);
      setSubmitError(error.response?.data?.message || error.message || 'Failed to update problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToSearch = () => {
    setProblem(null);
    setSearchId('');
    reset();
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl bg-gray-50 min-h-screen">
      {!problem ? (
        <div className="card bg-white shadow-md p-6 rounded-lg max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiEdit className="mr-2" />
            Update Problem
          </h1>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Search Problem by ID</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter problem ID"
                className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="btn btn-primary"
              >
                {isSearching ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <FiSearch className="mr-1" />
                    Search
                  </>
                )}
              </button>
            </div>
            {searchError && (
              <span className="text-error text-sm mt-1">{searchError}</span>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToSearch}
              className="btn btn-ghost hover:bg-gray-200"
            >
              <FiArrowLeft className="mr-1" />
              Back to Search
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiEdit className="mr-2" />
              Update Problem: {problem.title}
            </h1>
            <div className="w-24"></div>
          </div>

          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span className="text-sm font-medium text-gray-500">PROBLEM TITLE</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 truncate">{problem.title}</h3>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span className="text-xs font-medium text-gray-500">DIFFICULTY</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  problem.difficulty === 'easy' ? 'bg-green-300 text-green-800' :
                  problem.difficulty === 'medium' ? 'bg-yellow-100 text-black-800' : 
                  'bg-red-200 text-red-800'
                }`}>
                  {problem.difficulty}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  <span className="text-xs font-medium text-gray-500">CATEGORY</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                  {problem.tags}
                </span>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="alert alert-error mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
            {/* Basic Information */}
            <div className="card bg-white shadow-md hover:shadow-lg transition-shadow p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Title*</span>
                  </label>
                  <input
                    {...register('title')}
                    className={`input input-bordered w-full ${errors.title ? 'input-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                    placeholder="Problem title"
                  />
                  {errors.title && (
                    <span className="text-error text-sm mt-1">{errors.title.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Description*</span>
                  </label>
                  <textarea
                    {...register('description')}
                    className={`textarea textarea-bordered w-full h-40 ${errors.description ? 'textarea-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                    placeholder="Detailed problem description"
                  />
                  {errors.description && (
                    <span className="text-error text-sm mt-1">{errors.description.message}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Difficulty*</span>
                    </label>
                    <select
                      {...register('difficulty')}
                      className={`select select-bordered w-full ${errors.difficulty ? 'select-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    {errors.difficulty && (
                      <span className="text-error text-sm mt-1">{errors.difficulty.message}</span>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Tags*</span>
                    </label>
                    <select
                      {...register('tags')}
                      className={`select select-bordered w-full ${errors.tags ? 'select-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                    >
                      <option value="array">Array</option>
                      <option value="linkedList">Linked List</option>
                      <option value="graph">Graph</option>
                      <option value="dp">Dynamic Programming</option>
                    </select>
                    {errors.tags && (
                      <span className="text-error text-sm mt-1">{errors.tags.message}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Test Cases */}
            <div className="card bg-white shadow-md hover:shadow-lg transition-shadow p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <FiCpu className="text-xl text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-700">Test Cases</h2>
              </div>
              
              {/* Visible Test Cases */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiUnlock className="text-green-500 mr-2" />
                    <h3 className="font-medium text-gray-700">Visible Test Cases*</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                    className="btn btn-sm btn-primary"
                  >
                    <FiPlus className="mr-1" />
                    Add Case
                  </button>
                </div>
                
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 p-4 rounded-lg space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Test Case #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeVisible(index)}
                        className="btn btn-xs btn-error"
                        disabled={visibleFields.length <= 1}
                      >
                        <FiTrash2 className="mr-1" />
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Input*</span>
                        </label>
                        <textarea
                          {...register(`visibleTestCases.${index}.input`)}
                          placeholder="Test case input"
                          className={`textarea textarea-bordered w-full ${errors.visibleTestCases?.[index]?.input ? 'textarea-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                          rows={2}
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Expected Output*</span>
                        </label>
                        <textarea
                          {...register(`visibleTestCases.${index}.output`)}
                          placeholder="Expected output"
                          className={`textarea textarea-bordered w-full ${errors.visibleTestCases?.[index]?.output ? 'textarea-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                          rows={2}
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Explanation*</span>
                        </label>
                        <textarea
                          {...register(`visibleTestCases.${index}.explanation`)}
                          placeholder="Explanation of test case"
                          className={`textarea textarea-bordered w-full ${errors.visibleTestCases?.[index]?.explanation ? 'textarea-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hidden Test Cases */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiLock className="text-red-500 mr-2" />
                    <h3 className="font-medium text-gray-700">Hidden Test Cases*</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendHidden({ input: '', output: '' })}
                    className="btn btn-sm btn-primary"
                  >
                    <FiPlus className="mr-1" />
                    Add Case
                  </button>
                </div>
                
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 p-4 rounded-lg space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Hidden Case #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeHidden(index)}
                        className="btn btn-xs btn-error"
                        disabled={hiddenFields.length <= 1}
                      >
                        <FiTrash2 className="mr-1" />
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Input*</span>
                        </label>
                        <textarea
                          {...register(`hiddenTestCases.${index}.input`)}
                          placeholder="Test case input"
                          className={`textarea textarea-bordered w-full ${errors.hiddenTestCases?.[index]?.input ? 'textarea-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                          rows={2}
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Expected Output*</span>
                        </label>
                        <textarea
                          {...register(`hiddenTestCases.${index}.output`)}
                          placeholder="Expected output"
                          className={`textarea textarea-bordered w-full ${errors.hiddenTestCases?.[index]?.output ? 'textarea-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Templates */}
            <div className="card bg-white shadow-md hover:shadow-lg transition-shadow p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Code Templates</h2>
              
              {/* Starter Code */}
              <div className="space-y-6 mb-8">
                <h3 className="text-lg font-medium text-gray-700">Starter Code*</h3>
                
                {startCodeFields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <input
                      type="hidden"
                      {...register(`startCode.${index}.language`)}
                      value={field.language}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      {languageOptions.find(lang => lang.value === field.language)?.icon}
                      <span className="font-medium capitalize">
                        {field.language === 'c++' ? 'C++' : field.language}
                      </span>
                    </div>
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className={`textarea textarea-bordered w-full h-40 font-mono text-sm ${errors.startCode?.[index]?.initialCode ? 'textarea-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                      placeholder={`Enter ${field.language} starter code`}
                    />
                    {errors.startCode?.[index]?.initialCode && (
                      <span className="text-error text-sm">{errors.startCode[index].initialCode.message}</span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Reference Solution */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700">Reference Solution*</h3>
                
                {referenceSolutionFields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <input
                      type="hidden"
                      {...register(`referenceSolution.${index}.language`)}
                      value={field.language}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      {languageOptions.find(lang => lang.value === field.language)?.icon}
                      <span className="font-medium capitalize">
                        {field.language === 'c++' ? 'C++' : field.language}
                      </span>
                    </div>
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className={`textarea textarea-bordered w-full h-40 font-mono text-sm ${errors.referenceSolution?.[index]?.completeCode ? 'textarea-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                      placeholder={`Enter ${field.language} complete solution`}
                    />
                    {errors.referenceSolution?.[index]?.completeCode && (
                      <span className="text-error text-sm">{errors.referenceSolution[index].completeCode.message}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={handleBackToSearch}
                className="btn btn-ghost hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary hover:bg-blue-600 transition-colors"
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-1" />
                    Update Problem
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default AdminUpdatePanel;