import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosClient from '../utils/axiosClient';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Code, ChevronDown, TestTube2, Lock, Eye, HardHat, Medal, Trophy, Tag } from 'lucide-react';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  premium: z.boolean().default(false),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(z.object({
    input: z.string().min(1),
    output: z.string().min(1),
    explanation: z.string().min(1)
  })).min(1),
  hiddenTestCases: z.array(z.object({
    input: z.string().min(1),
    output: z.string().min(1)
  })).min(1),
  startCode: z.array(z.object({
    language: z.enum(['c++', 'java', 'javascript']),
    initialCode: z.string().min(1)
  })).length(3),
  referenceSolution: z.array(z.object({
    language: z.enum(['c++', 'java', 'javascript']),
    completeCode: z.string().min(1)
  })).length(3),
});

const difficultyIcons = {
  easy: <Medal className="w-4 h-4 text-green-500 dark:text-green-400" />,
  medium: <Trophy className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />,
  hard: <HardHat className="w-4 h-4 text-red-500 dark:text-red-400" />
};

const tagIcons = {
  array: <Tag className="w-4 h-4 text-blue-500 dark:text-blue-400" />,
  linkedList: <Tag className="w-4 h-4 text-purple-500 dark:text-purple-400" />,
  graph: <Tag className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />,
  dp: <Tag className="w-4 h-4 text-orange-500 dark:text-orange-400" />
};

const AdminCreatePanel = () => {
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'c++', initialCode: '' },
        { language: 'java', initialCode: '' },
        { language: 'javascript', initialCode: '' },
      ],
      referenceSolution: [
        { language: 'c++', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' },
      ],
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        problemCreator: user._id
      };
      const response = await axiosClient.post('/problem/create', payload);
      if (response.status === 201) {
        alert('Problem created successfully!');
        reset();
        navigate('/admin');
      }
    } catch (error) {
      console.error('Create error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to create problem');
    }
  };

  const currentDifficulty = watch('difficulty');
  const currentTag = watch('tags');
  const isPremium = watch('premium');

  return (
    <div className={`p-6 max-w-6xl mx-auto rounded-lg shadow-md transition-colors duration-300 ${
      darkMode ? 
      "bg-gray-800 border border-gray-700 shadow-xl shadow-indigo-900/20" : 
      "bg-white border border-gray-200"
    }`}>
      <h2 className={`text-3xl font-bold mb-6 flex items-center gap-2 transition-colors duration-300 ${
        darkMode ? "text-white" : "text-gray-800"
      }`}>
        <Code className={`text-indigo-600 ${darkMode ? "animate-pulse" : ""}`} />
        Create New Problem
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium transition-colors duration-300 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>Title</label>
            <input 
              {...register('title')} 
              placeholder="Problem title" 
              className={`input w-full transition-colors duration-300 ${
                darkMode ? 
                "bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500" : 
                "input-bordered"
              } ${errors.title ? 'input-error' : ''}`} 
            />
            {errors.title && <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.title.message}
            </p>}
          </div>

          {/* Premium Toggle */}
          <div className="flex items-center justify-end">
            <label className="flex items-center cursor-pointer gap-2">
              <span className={`label-text font-medium transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>Premium Problem</span> 
              <input 
                type="checkbox" 
                {...register('premium')}
                className={`toggle ${darkMode ? 'toggle-primary  text-yellow-500 border-yellow-500' : 'toggle-secondary '}`} 
              />
              <Lock className={`w-4 h-4 ${isPremium ? 'text-green animate-pulse' : 'text-indigo-600'}`} />
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}>Description</label>
          <textarea 
            {...register('description')} 
            placeholder="Detailed problem description" 
            rows={4}
            className={`textarea w-full transition-colors duration-300 ${
              darkMode ? 
              "bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500" : 
              "textarea-bordered"
            } ${errors.description ? 'textarea-error' : ''}`} 
          />
          {errors.description && <p className="text-sm text-red-500 dark:text-red-400">{errors.description.message}</p>}
        </div>

        {/* Difficulty and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium flex items-center gap-1 transition-colors duration-300 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Difficulty
              {currentDifficulty && difficultyIcons[currentDifficulty]}
            </label>
            <div className="relative">
              <select 
                {...register('difficulty')} 
                className={`select w-full transition-colors duration-300 ${
                  darkMode ? 
                  "bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500" : 
                  "select-bordered"
                } ${errors.difficulty ? 'select-error' : ''}`}
              >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <ChevronDown className={`absolute right-3 top-3 h-4 w-4 transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`} />
            </div>
            {errors.difficulty && <p className="text-sm text-red-500 dark:text-red-400">{errors.difficulty.message}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium flex items-center gap-1 transition-colors duration-300 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Tags
              {currentTag && tagIcons[currentTag]}
            </label>
            <div className="relative">
              <select 
                {...register('tags')} 
                className={`select w-full transition-colors duration-300 ${
                  darkMode ? 
                  "bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500" : 
                  "select-bordered"
                } ${errors.tags ? 'select-error' : ''}`}
              >
                <option value="">Select tag</option>
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">Dynamic Programming</option>
              </select>
              <ChevronDown className={`absolute right-3 top-3 h-4 w-4 transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`} />
            </div>
            {errors.tags && <p className="text-sm text-red-500 dark:text-red-400">{errors.tags.message}</p>}
          </div>
        </div>

        {/* Test Cases Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visible Test Cases */}
          <div className={`border rounded-lg p-4 transition-colors duration-300 ${
            darkMode ? 
            "bg-gray-700 border-gray-600 shadow-lg shadow-indigo-900/20" : 
            "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-lg flex items-center gap-2 transition-colors duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                <Eye className="text-indigo-600" />
                Visible Test Cases
              </h3>
              <button 
                type="button" 
                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                className={`btn btn-sm transition-colors duration-300 ${
                  darkMode ? 
                  "bg-indigo-700 hover:bg-indigo-600 text-white" : 
                  "btn-primary"
                }`}
              >
                <Plus className="h-4 w-4" />
                Add Case
              </button>
            </div>
            
            <div className="space-y-4">
              {visibleFields.map((field, index) => (
                <div key={field.id} className={`p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode ? 
                  "bg-gray-800 border-gray-700 hover:shadow-indigo-500/20" : 
                  "bg-white border-gray-200 hover:shadow-md"
                }`}>
                  <div className="space-y-3">
                    <div>
                      <label className={`text-sm transition-colors duration-300 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}>Input</label>
                      <textarea 
                        {...register(`visibleTestCases.${index}.input`)} 
                        placeholder="Input" 
                        className={`textarea w-full text-sm transition-colors duration-300 ${
                          darkMode ? 
                          "bg-gray-700 border-gray-600 text-white focus:border-indigo-500" : 
                          "textarea-bordered"
                        }`} 
                      />
                    </div>
                    <div>
                      <label className={`text-sm transition-colors duration-300 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}>Output</label>
                      <textarea 
                        {...register(`visibleTestCases.${index}.output`)} 
                        placeholder="Output" 
                        className={`textarea w-full text-sm transition-colors duration-300 ${
                          darkMode ? 
                          "bg-gray-700 border-gray-600 text-white focus:border-indigo-500" : 
                          "textarea-bordered"
                        }`} 
                      />
                    </div>
                    <div>
                      <label className={`text-sm transition-colors duration-300 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}>Explanation</label>
                      <textarea 
                        {...register(`visibleTestCases.${index}.explanation`)} 
                        placeholder="Explanation" 
                        className={`textarea w-full text-sm transition-colors duration-300 ${
                          darkMode ? 
                          "bg-gray-700 border-gray-600 text-white focus:border-indigo-500" : 
                          "textarea-bordered"
                        }`} 
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeVisible(index)}
                    className={`btn btn-sm btn-ghost mt-2 transition-colors duration-300 ${
                      darkMode ? "text-red-400 hover:bg-gray-700" : "text-red-500"
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div className={`border rounded-lg p-4 transition-colors duration-300 ${
            darkMode ? 
            "bg-gray-700 border-gray-600 shadow-lg shadow-indigo-900/20" : 
            "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-lg flex items-center gap-2 transition-colors duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                <Lock className="text-indigo-600" />
                Hidden Test Cases
              </h3>
              <button 
                type="button" 
                onClick={() => appendHidden({ input: '', output: '' })}
                className={`btn btn-sm transition-colors duration-300 ${
                  darkMode ? 
                  "bg-indigo-700 hover:bg-indigo-600 text-white" : 
                  "btn-primary"
                }`}
              >
                <Plus className="h-4 w-4" />
                Add Case
              </button>
            </div>
            
            <div className="space-y-4">
              {hiddenFields.map((field, index) => (
                <div key={field.id} className={`p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode ? 
                  "bg-gray-800 border-gray-700 hover:shadow-indigo-500/20" : 
                  "bg-white border-gray-200 hover:shadow-md"
                }`}>
                  <div className="space-y-3">
                    <div>
                      <label className={`text-sm transition-colors duration-300 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}>Input</label>
                      <textarea 
                        {...register(`hiddenTestCases.${index}.input`)} 
                        placeholder="Input" 
                        className={`textarea w-full text-sm transition-colors duration-300 ${
                          darkMode ? 
                          "bg-gray-700 border-gray-600 text-white focus:border-indigo-500" : 
                          "textarea-bordered"
                        }`} 
                      />
                    </div>
                    <div>
                      <label className={`text-sm transition-colors duration-300 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}>Output</label>
                      <textarea 
                        {...register(`hiddenTestCases.${index}.output`)} 
                        placeholder="Output" 
                        className={`textarea w-full text-sm transition-colors duration-300 ${
                          darkMode ? 
                          "bg-gray-700 border-gray-600 text-white focus:border-indigo-500" : 
                          "textarea-bordered"
                        }`} 
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeHidden(index)}
                    className={`btn btn-sm btn-ghost mt-2 transition-colors duration-300 ${
                      darkMode ? "text-red-400 hover:bg-gray-700" : "text-red-500"
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Sections */}
        <div className="grid grid-cols-1 gap-6">
          {/* Starter Code */}
          <div className={`border rounded-lg p-4 transition-colors duration-300 ${
            darkMode ? 
            "bg-gray-700 border-gray-600 shadow-lg shadow-indigo-900/20" : 
            "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`font-semibold text-lg mb-4 flex items-center gap-2 transition-colors duration-300 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              <Code className="text-indigo-600" />
              Starter Code
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['c++', 'java', 'javascript'].map((lang, index) => (
                <div key={lang} className={`p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode ? 
                  "bg-gray-800 border-gray-700 hover:shadow-indigo-500/20" : 
                  "bg-white border-gray-200 hover:shadow-md"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`badge badge-outline transition-colors duration-300 ${
                      lang === 'c++' ? 
                        darkMode ? "badge-primary" : "badge-primary" :
                      lang === 'java' ? 
                        darkMode ? "badge-secondary" : "badge-secondary" : 
                        darkMode ? "badge-accent" : "badge-accent"
                    }`}>
                      {lang}
                    </div>
                  </div>
                  <textarea 
                    {...register(`startCode.${index}.initialCode`)} 
                    placeholder={`${lang} starter code`} 
                    className={`textarea w-full h-40 font-mono text-sm transition-colors duration-300 ${
                      darkMode ? 
                      "bg-gray-900 border-gray-700 text-gray-100 focus:border-indigo-500" : 
                      "textarea-bordered"
                    }`} 
                  />
                  <input type="hidden" value={lang} {...register(`startCode.${index}.language`)} />
                </div>
              ))}
            </div>
          </div>

          {/* Reference Solution */}
          <div className={`border rounded-lg p-4 transition-colors duration-300 ${
            darkMode ? 
            "bg-gray-700 border-gray-600 shadow-lg shadow-indigo-900/20" : 
            "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`font-semibold text-lg mb-4 flex items-center gap-2 transition-colors duration-300 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              <TestTube2 className="text-indigo-600" />
              Reference Solution
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['c++', 'java', 'javascript'].map((lang, index) => (
                <div key={lang} className={`p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode ? 
                  "bg-gray-800 border-gray-700 hover:shadow-indigo-500/20" : 
                  "bg-white border-gray-200 hover:shadow-md"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`badge badge-outline transition-colors duration-300 ${
                      lang === 'c++' ? 
                        darkMode ? "badge-primary" : "badge-primary" :
                      lang === 'java' ? 
                        darkMode ? "badge-secondary" : "badge-secondary" : 
                        darkMode ? "badge-accent" : "badge-accent"
                    }`}>
                      {lang}
                    </div>
                  </div>
                  <textarea 
                    {...register(`referenceSolution.${index}.completeCode`)} 
                    placeholder={`${lang} reference solution`} 
                    className={`textarea w-full h-40 font-mono text-sm transition-colors duration-300 ${
                      darkMode ? 
                      "bg-gray-900 border-gray-700 text-gray-100 focus:border-indigo-500" : 
                      "textarea-bordered"
                    }`} 
                  />
                  <input type="hidden" value={lang} {...register(`referenceSolution.${index}.language`)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            className={`btn px-8 transition-all duration-300 ${
              darkMode ? 
              "bg-indigo-700 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40" : 
              "btn-primary"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-1" />
                Create Problem
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreatePanel;