import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCrown, FiActivity, FiClock, FiZap } = FiIcons;

const PlanOverview = ({ plan, usage }) => {
  // Define limits based on plan
  const limits = {
    Free: { rate: 10, daily: 100 },
    Lite: { rate: 500, daily: 5000 },
    Pro: { rate: 2000, daily: 25000 },
    Enterprise: { rate: Infinity, daily: Infinity }
  };

  const currentLimits = limits[plan] || limits.Free;
  
  // Calculate usage percentages
  const rateUsagePercent = currentLimits.rate === Infinity ? 
    0 : Math.min((usage.last15Min / currentLimits.rate) * 100, 100);
  
  const dailyUsagePercent = currentLimits.daily === Infinity ? 
    0 : Math.min((usage.daily / currentLimits.daily) * 100, 100);

  const planColors = {
    Free: 'bg-gray-100 text-gray-800',
    Lite: 'bg-blue-100 text-blue-800',
    Pro: 'bg-purple-100 text-purple-800',
    Enterprise: 'bg-indigo-100 text-indigo-800'
  };

  const features = {
    Free: ['Basic conversion', '10 calls per 15 minutes', '100 daily limit'],
    Lite: ['Quick processing', '500 calls per 15 minutes', '5,000 daily limit'],
    Pro: ['Priority processing', '2,000 calls per 15 minutes', '25,000 daily limit'],
    Enterprise: ['Custom endpoints', 'Unlimited rate limit', 'Unlimited daily limit']
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiCrown} className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${planColors[plan]}`}>
          {plan}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Rate Limit Usage */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiActivity} className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-700">Rate Limit</span>
            </div>
            <span className="text-sm text-gray-500">
              {usage.last15Min} / {currentLimits.rate === Infinity ? '∞' : currentLimits.rate}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rateUsagePercent}%` }}
              className={`h-full rounded-full ${
                rateUsagePercent > 90 ? 'bg-red-500' : 
                rateUsagePercent > 75 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Daily Usage */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiClock} className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-700">Daily Usage</span>
            </div>
            <span className="text-sm text-gray-500">
              {usage.daily} / {currentLimits.daily === Infinity ? '∞' : currentLimits.daily}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dailyUsagePercent}%` }}
              className={`h-full rounded-full ${
                dailyUsagePercent > 90 ? 'bg-red-500' : 
                dailyUsagePercent > 75 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Features</h3>
        <ul className="space-y-3">
          {features[plan].map((feature, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <SafeIcon icon={FiZap} className="h-5 w-5 text-blue-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanOverview;