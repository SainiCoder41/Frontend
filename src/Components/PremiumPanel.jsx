import React from 'react';
import { NavLink } from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';


import { Trophy, Zap, Crown, Gem, BadgePercent, Check, Star, Calendar, Database, Code2, Clock, LockKeyhole, Users, Bookmark } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const PremiumPanel = () => {

 const plans = [
    {
      id: 1,
      name: 'Monthly',
      price: '35',
      period: 'per month',
      popular: true,
      features: [
        'Access to premium content',
        'Unlimited question access',
        'Detailed solution explanations',
        'Debugger support',
        'Interview simulation'
      ],
      icon: <Calendar className="w-6 h-6 text-orange-500" />,
      color: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 2,
      name: 'Annual',
      price: '159',
      period: 'per year',
      originalPrice: '$420',
      popular: true,
      features: [
        'Everything in Monthly',
        '62% savings',
        'Priority customer support',
        'Exclusive interview questions',
        'Company-specific questions',
        'Bi-weekly coding contests'
      ],
      icon: <Trophy className="w-6 h-6 text-leetcode-yellow" />,
      color: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      id: 3,
      name: 'Student',
      price: '99',
      period: 'per year',
      popular: true,
      features: [
        'Everything in Annual',
        'Special student discount',
        'Academic resources',
        'Learning paths',
        'Study groups access',
        'Career guidance'
      ],
      icon: <Bookmark className="w-6 h-6 text-green-500" />,
      color: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];
  // Payment Integration
 const makePayment = async (Price) => {
  try{
    console.log(Price)
    const response = await axiosClient.post("/api/payment",{
      amount:Price
    });

    // if(response && response.status == 200){
    //   console.log(response.data);
    // }
        if (response?.data?.url) {
      
      window.location.href = response.data.url;
    } else {
      console.error("Stripe session URL not received");
    }

  }catch(error){
     console.error("Payment error:", error);
  }
};


  // LeetCode-style premium plans
 

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 rounded-xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          LeetCode Premium
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of your coding interview preparation with premium features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl shadow-md overflow-hidden border ${plan.popular ? 'border-leetcode-yellow border-2' : 'border-gray-200'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-leetcode-yellow text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                <BadgePercent className="inline mr-1" size={14} />
                BEST VALUE
              </div>
            )}
            
            <div className={`p-6 ${plan.color}`}>
              <div className="flex items-center mb-4">
                {plan.icon}
                <h3 className={`ml-3 text-xl font-bold ${plan.textColor}`}>
                  {plan.name}
                </h3>
              </div>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-md font-medium text-gray-500 ml-1">
                  {plan.period}
                </span>
                {plan.originalPrice && (
                  <div className="text-sm text-gray-500 line-through mt-1">
                    {plan.originalPrice}
                  </div>
                )}
              </div>
              
           <button 
  onClick={() => makePayment(plan.price)} // Pass the plan ID
  className={`w-full py-3 px-6 rounded-lg font-medium ${
    plan.popular
      ? 'bg-leetcode-yellow text-gray-900 hover:bg-yellow-500'
      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
  }`}
>
  Subscribe Now
</button>
              
            </div>
            
            <div className="p-6 bg-white">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Star className="w-4 h-4 text-leetcode-yellow mr-2" />
                Premium Features
              </h4>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                    <span className="ml-2 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-bold text-center mb-6">All Premium Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <Code2 className="w-5 h-5 text-blue-500 mr-2" />
              <h4 className="font-medium">Premium Questions</h4>
            </div>
            <p className="text-gray-600 text-sm">Access to 1900+ premium questions</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <Database className="w-5 h-5 text-green-500 mr-2" />
              <h4 className="font-medium">Company Questions</h4>
            </div>
            <p className="text-gray-600 text-sm">Top interview questions from specific companies</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-purple-500 mr-2" />
              <h4 className="font-medium">Interview Simulations</h4>
            </div>
            <p className="text-gray-600 text-sm">Mock interviews with timing and evaluation</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <LockKeyhole className="w-5 h-5 text-red-500 mr-2" />
              <h4 className="font-medium">Solution Explanations</h4>
            </div>
            <p className="text-gray-600 text-sm">Detailed explanations for all solutions</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-orange-500 mr-2" />
              <h4 className="font-medium">Debugger</h4>
            </div>
            <p className="text-gray-600 text-sm">Built-in debugger for your code</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              <h4 className="font-medium">Performance Tools</h4>
            </div>
            <p className="text-gray-600 text-sm">Detailed runtime and memory analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPanel;