import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { Calendar, Clock, Award, Trophy, Lock, Unlock, XCircle, CheckCircle, X } from 'lucide-react';

const ContestPanel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prizes, setPrizes] = useState([{ rank: '', amount: '' }]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startTime: '',
      duration: 60,
      difficulty: 'Medium',
      contestType: 'Weekly',
      premiumOnly: false,
      prizePool: '',
    },
  });

  const showNotification = (message = '', type = 'success') => {
    setNotification({ show: false, message: '', type: '' });
    setTimeout(() => {
      setNotification({
        show: true,
        message,
        type: type.toLowerCase()
      });
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    }, 0);
  };

  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  const watchStartTime = watch('startTime');
  const watchPremiumOnly = watch('premiumOnly');

  const addPrize = () => {
    setPrizes([...prizes, { rank: '', amount: '' }]);
  };

  const removePrize = (index) => {
    if (prizes.length > 1) {
      const updatedPrizes = [...prizes];
      updatedPrizes.splice(index, 1);
      setPrizes(updatedPrizes);
    }
  };

  const handlePrizeChange = (index, field, value) => {
    const updatedPrizes = [...prizes];
    updatedPrizes[index][field] = value;
    setPrizes(updatedPrizes);
  };

  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return '';
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    return end.toISOString();
  };

  const onSubmit = async (data) => {
    const filteredPrizes = prizes.filter(prize => prize.rank && prize.amount);
    
    if (filteredPrizes.length === 0) {
      showNotification('Please add at least one valid prize', 'error');
      return;
    }

    const contestData = {
      ...data,
      prizes: filteredPrizes,
      endTime: calculateEndTime(data.startTime, data.duration),
    };

    setIsSubmitting(true);
    try {
      const response = await axiosClient.post('/contest/create', contestData);
      if (response.data.success) {
        showNotification('Contest created successfully!', 'success');
        reset({
          title: '',
          description: '',
          startTime: '',
          duration: 60,
          prizePool: '',
          difficulty: 'Medium',
          contestType: 'Weekly',
          premiumOnly: false,
        });
        setPrizes([{ rank: '', amount: '' }]);
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        showNotification(response.data.message || 'Failed to create contest', 'error');
      }
    } catch (error) {
      console.error('Error creating contest:', error);
      const errorMsg = error.response?.data?.message || 'Error creating contest';
      showNotification(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 flex items-center space-x-4 border-l-4 ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-500' 
            : 'bg-red-50 text-red-800 border-red-500'
        }`}>
          
          <div className="flex-1 max-w-md">
            <div className="font-medium">
              {notification.type === 'success' ? 'Error' : 'Success'}
            </div>
            <div>{notification.message}</div>
          </div>
          <button 
            onClick={closeNotification}
            className="p-1 rounded-full hover:bg-opacity-20 transition-colors"
          >
            <X className={`h-5 w-5 ${
              notification.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`} />
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Trophy className="mr-2 text-yellow-500" />
        Create New Contest
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contest Title*
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Weekly Coding Challenge"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <XCircle className="mr-1 h-4 w-4" />
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contest Type*
            </label>
            <select
              {...register('contestType', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Weekly">Weekly</option>
              <option value="Biweekly">Biweekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Special">Special</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Prize Pool*
            </label>
            <input
              type="number"
              {...register('prizePool', { 
                required: 'Prize pool is required',
                min: { value: 0, message: 'Prize pool cannot be negative' }
              })}
              className={`w-full px-3 py-2 border rounded-md ${errors.prizePool ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., 1000"
              min="0"
            />
            {errors.prizePool && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <XCircle className="mr-1 h-4 w-4" />
                {errors.prizePool.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Describe the contest details..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <XCircle className="mr-1 h-4 w-4" />
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Start Time*
            </label>
            <input
              type="datetime-local"
              {...register('startTime', { required: 'Start time is required' })}
              className={`w-full px-3 py-2 border rounded-md ${errors.startTime ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <XCircle className="mr-1 h-4 w-4" />
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              Duration (minutes)*
            </label>
            <input
              type="number"
              {...register('duration', { 
                required: 'Duration is required',
                min: { value: 1, message: 'Duration must be at least 1 minute' }
              })}
              className={`w-full px-3 py-2 border rounded-md ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
              min="1"
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <XCircle className="mr-1 h-4 w-4" />
                {errors.duration.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated End Time
            </label>
            <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {watchStartTime ? (
                calculateEndTime(watchStartTime, watch('duration'))
              ) : (
                <span className="text-gray-400">Set start time first</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level*
            </label>
            <select
              {...register('difficulty', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Easy">Easy</option>
              <option value="Easy-Medium">Easy-Medium</option>
              <option value="Medium">Medium</option>
              <option value="Medium-Hard">Medium-Hard</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  {...register('premiumOnly')}
                  className="sr-only"
                  checked={watchPremiumOnly}
                  onChange={(e) => setValue('premiumOnly', e.target.checked)}
                />
                <div className={`block w-14 h-8 rounded-full ${watchPremiumOnly ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${watchPremiumOnly ? 'transform translate-x-6' : ''}`}
                ></div>
              </div>
              <div className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                {watchPremiumOnly ? (
                  <Lock className="h-4 w-4 mr-1 text-blue-600" />
                ) : (
                  <Unlock className="h-4 w-4 mr-1 text-gray-600" />
                )}
                Premium Only
              </div>
            </label>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <Award className="mr-2 text-yellow-500" />
              Prizes*
            </h3>
            <button
              type="button"
              onClick={addPrize}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm hover:bg-blue-200 flex items-center"
            >
              + Add Prize
            </button>
          </div>

          {prizes.map((prize, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rank/Range*
                </label>
                <input
                  type="text"
                  value={prize.rank}
                  onChange={(e) => handlePrizeChange(index, 'rank', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 1 or 4-10"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount*
                </label>
                <input
                  type="text"
                  value={prize.amount}
                  onChange={(e) => handlePrizeChange(index, 'amount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., $100 or 500 coins"
                  required
                />
              </div>
              <div>
                {prizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrize(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 flex items-center"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md text-white flex items-center ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Create Contest
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContestPanel;