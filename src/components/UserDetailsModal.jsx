import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import UsageChart from './UsageChart';
import AdminPlanManager from './AdminPlanManager';
import * as FiIcons from 'react-icons/fi';

const {
  FiX,
  FiUser,
  FiCalendar,
  FiKey,
  FiActivity,
  FiClock,
  FiToggleLeft,
  FiToggleRight,
  FiAlertCircle,
  FiCheckCircle,
  FiCrown,
  FiEdit2,
  FiSave
} = FiIcons;

const UserDetailsModal = ({ user, isOpen, onClose, onToggleUserStatus, onUpdateUser, onUpdatePlan }) => {
  const [editMode, setEditMode] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [activeTab, setActiveTab] = useState('details');

  // Reset state when modal opens with new user
  React.useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name,
        email: user.email
      });
      setEditMode(false);
      setError(null);
      setSuccess(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleToggleStatus = async () => {
    setToggleLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await onToggleUserStatus(user.id, !user.is_active);
      setSuccess(`User ${user.is_active ? 'disabled' : 'enabled'} successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to ${user.is_active ? 'disable' : 'enable'} user: ${err.message}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setToggleLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    setUpdateLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await onUpdateUser(user.id, editedUser);
      setSuccess('User updated successfully');
      setEditMode(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to update user: ${err.message}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdatePlan = async (newPlan) => {
    setError(null);
    setSuccess(null);
    try {
      await onUpdatePlan(user.id, newPlan);
      setSuccess(`Plan updated to ${newPlan} successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to update plan: ${err.message}`);
      setTimeout(() => setError(null), 5000);
    }
  };

  // Format daily data for chart
  const dailyData = user.usage?.daily_requests
    ? Object.entries(user.usage.daily_requests)
        .sort((a, b) => a[0].localeCompare(b[0])) // Sort by date
        .map(([date, count]) => ({ date, count: Number(count) }))
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-4">
              <SafeIcon icon={FiAlertCircle} className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center mb-4">
              <SafeIcon icon={FiCheckCircle} className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="h-8 w-8 text-gray-600" />
            </div>
            <div className="flex-grow">
              {editMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
                </>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${user.plan === 'Free' ? 'bg-gray-100 text-gray-800' :
                      user.plan === 'Lite' ? 'bg-blue-100 text-blue-800' :
                      user.plan === 'Pro' ? 'bg-purple-100 text-purple-800' :
                      'bg-indigo-100 text-indigo-800'}
                  `}
                >
                  {user.plan || 'Free'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {editMode ? (
                <button
                  onClick={handleUpdateUser}
                  disabled={updateLoading}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <SafeIcon icon={FiSave} className="h-4 w-4 mr-1" />
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <SafeIcon icon={FiEdit2} className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
              <button
                onClick={handleToggleStatus}
                disabled={toggleLoading}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  user.is_active
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } ${toggleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <SafeIcon
                  icon={user.is_active ? FiToggleRight : FiToggleLeft}
                  className={`h-4 w-4 mr-1 ${toggleLoading ? 'animate-pulse' : ''}`}
                />
                {toggleLoading ? 'Processing...' : user.is_active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Details
              </button>
              <button
                onClick={() => setActiveTab('plan')}
                className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'plan'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <SafeIcon icon={FiCrown} className="h-4 w-4 mr-1" />
                  Plan Management
                </div>
              </button>
            </nav>
          </div>

          {activeTab === 'details' ? (
            <>
              {/* Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <SafeIcon icon={FiKey} className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-sm text-gray-600 font-mono break-all">
                          {user.api_key}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Full API key (visible only in admin view)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Usage Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiActivity} className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {user.usage?.total_requests?.toLocaleString() || '0'} total requests
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiClock} className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {user.usage?.this_month || '0'} requests this month
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiClock} className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {user.usage?.today || '0'} requests today
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiClock} className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Last request:{' '}
                        {user.usage?.last_request
                          ? new Date(user.usage.last_request).toLocaleString()
                          : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Chart */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Usage Over Time</h4>
                {dailyData.length > 0 ? (
                  <div className="h-64 bg-white rounded-lg border border-gray-200">
                    <UsageChart data={dailyData} />
                  </div>
                ) : (
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm">No usage data available</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <AdminPlanManager
              currentPlan={user.plan || 'Free'}
              onUpdatePlan={handleUpdatePlan}
              loading={updateLoading}
            />
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          {editMode && (
            <button
              onClick={() => {
                setEditMode(false);
                setEditedUser({ name: user.name, email: user.email });
              }}
              className="px-4 py-2 mr-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailsModal;