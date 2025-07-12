import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import UserUsageStats from './UserUsageStats';
import * as FiIcons from 'react-icons/fi';

const { 
  FiX, 
  FiUser, 
  FiMail, 
  FiKey, 
  FiCalendar, 
  FiToggleLeft, 
  FiToggleRight,
  FiCheck,
  FiAlertCircle,
  FiCreditCard 
} = FiIcons;

const UserDetailsModal = ({ user, isOpen, onClose, onToggleUserStatus, onUpdatePlan }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await onToggleUserStatus(user.id);
      
      setSuccess(`User ${user.is_active ? 'disabled' : 'enabled'} successfully`);
    } catch (err) {
      setError(err.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (newPlan) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await onUpdatePlan(user.id, newPlan);
      
      setSuccess(`Plan updated to ${newPlan} successfully`);
    } catch (err) {
      setError(err.message || 'Failed to update user plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiX} className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <SafeIcon icon={FiUser} className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="ml-2 inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {user.plan || 'Free'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('account')}
                className={`pb-2 px-1 ${
                  activeTab === 'account'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Account Details
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`pb-2 px-1 ${
                  activeTab === 'usage'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Usage Statistics
              </button>
              <button
                onClick={() => setActiveTab('plan')}
                className={`pb-2 px-1 ${
                  activeTab === 'plan'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Plan Management
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'account' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Name</span>
                  </div>
                  <p className="mt-1 text-gray-900">{user.name}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Email</span>
                  </div>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiKey} className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">API Key</span>
                  </div>
                  <div className="mt-1 flex items-center">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 overflow-x-auto">
                      {user.api_key}
                    </code>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCalendar} className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Joined</span>
                  </div>
                  <p className="mt-1 text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
                
                {success && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
                    <SafeIcon icon={FiCheck} className="h-5 w-5 mr-2" />
                    {success}
                  </div>
                )}
                
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                    <SafeIcon icon={FiAlertCircle} className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.is_active ? 'Account is active' : 'Account is disabled'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.is_active 
                        ? 'User can access the API and dashboard.' 
                        : 'User cannot access the API or dashboard.'}
                    </p>
                  </div>
                  <button
                    onClick={handleToggleStatus}
                    disabled={loading}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      user.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <SafeIcon
                      icon={user.is_active ? FiToggleRight : FiToggleLeft}
                      className="h-5 w-5 mr-2"
                    />
                    {user.is_active ? 'Disable Account' : 'Enable Account'}
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'usage' ? (
            <div>
              <UserUsageStats userId={user.id} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update User Plan</h3>
                
                {success && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
                    <SafeIcon icon={FiCheck} className="h-5 w-5 mr-2" />
                    {success}
                  </div>
                )}
                
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                    <SafeIcon icon={FiAlertCircle} className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Plan
                    </label>
                    <select
                      value={user.plan || 'Free'}
                      onChange={(e) => handleUpdatePlan(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Free">Free</option>
                      <option value="Lite">Lite</option>
                      <option value="Pro">Pro</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Plan Features:</h4>
                    <div className="space-y-2">
                      {user.plan === 'Free' && (
                        <>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            Basic conversion
                          </div>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            10 calls per 15 minutes
                          </div>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            100 daily limit
                          </div>
                        </>
                      )}
                      
                      {user.plan === 'Lite' && (
                        <>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            Quick processing
                          </div>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            500 calls per 15 minutes
                          </div>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            5,000 daily limit
                          </div>
                        </>
                      )}
                      
                      {user.plan === 'Pro' && (
                        <>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            Priority processing
                          </div>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            2,000 calls per 15 minutes
                          </div>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            25,000 daily limit
                          </div>
                        </>
                      )}
                      
                      {user.plan === 'Enterprise' && (
                        <>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            Custom endpoints
                          </div>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            Unlimited rate limit
                          </div>
                          <div className="flex items-center text-gray-600">
                            <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mr-2" />
                            Unlimited daily limit
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailsModal;