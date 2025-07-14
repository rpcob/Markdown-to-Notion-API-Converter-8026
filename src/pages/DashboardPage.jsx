import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import UserDetailsModal from '../components/UserDetailsModal';
import UserUsageStats from '../components/UserUsageStats';
import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiKey, FiRefreshCw, FiCopy, FiCheck, FiAlertCircle, FiShield, FiUsers, FiActivity, FiToggleLeft, FiToggleRight, FiSearch, FiFilter, FiEye, FiBarChart2 } = FiIcons;

const DashboardPage = () => {
  const { user, regenerateApiKey } = useAuth();
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  
  // Admin state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.email?.toLowerCase() === 'rpcob@yahoo.com';

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      // Fetch users from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profileError) throw profileError;
      
      // Fetch usage statistics for all users
      const { data: usageData, error: usageError } = await supabase
        .from('usage_statistics_qw78x2')
        .select('*');
      
      if (usageError) throw usageError;
      
      // Get monthly request counts for all users
      const userIds = profileData.map(u => u.id);
      const monthlyRequests = {};
      
      for (const userId of userIds) {
        const { data: monthlyData } = await supabase
          .rpc('get_monthly_requests', { user_uuid: userId });
        
        monthlyRequests[userId] = monthlyData || 0;
      }
      
      // Map usage data to users
      const usersWithUsage = profileData.map(profile => {
        const userUsage = usageData.find(u => u.user_id === profile.id) || {};
        const today = new Date().toISOString().split('T')[0];
        
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          created_at: profile.created_at,
          api_key: profile.api_key,
          is_active: profile.is_active !== false, // Default to true if not set
          usage: {
            total_requests: userUsage.requests_count || 0,
            this_month: monthlyRequests[profile.id] || 0,
            today: userUsage.daily_requests?.[today] || 0,
            last_request: userUsage.last_request || null,
            daily_requests: userUsage.daily_requests || {}
          }
        };
      });
      
      setUsers(usersWithUsage);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy to clipboard');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRegenerateApiKey = async () => {
    setRegenerating(true);
    setError(null);
    setSuccess(false);
    try {
      await regenerateApiKey();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to regenerate API key:', error);
      setError('Failed to regenerate API key. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleToggleUserStatus = async (userId, newStatus) => {
    try {
      // Update user status in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_active: newStatus } : u
      ));
      
      // If the selected user is the one being updated, update that too
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, is_active: newStatus });
      }
      
      return data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw new Error('Failed to update user status');
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    return matchesSearch && matchesStatus;
  });

  // Show loading state if user data is not available yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* User Overview Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <SafeIcon icon={FiUser} className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Account Overview</h1>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                <SafeIcon icon={FiAlertCircle} className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
                <SafeIcon icon={FiCheck} className="h-5 w-5 mr-2" />
                API key successfully regenerated!
              </div>
            )}

            {/* User Dashboard Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'account'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Account Information
                </button>
                <button
                  onClick={() => setActiveTab('usage')}
                  className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'usage'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <SafeIcon icon={FiBarChart2} className="h-4 w-4 mr-1" />
                    Usage Statistics
                  </div>
                </button>
              </nav>
            </div>

            {activeTab === 'account' ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                          <SafeIcon icon={FiShield} className="h-3 w-3 mr-1" />
                          Admin
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Member Since</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 mt-4 md:mt-0">API Configuration</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={user.api_key || ''}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono overflow-x-auto"
                        />
                        <button
                          onClick={() => copyToClipboard(user.api_key || '')}
                          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          disabled={!user.api_key}
                        >
                          <SafeIcon icon={copied ? FiCheck : FiCopy} className="h-4 w-4" />
                        </button>
                      </div>
                      {copied && (
                        <p className="text-sm text-green-600 mt-1">API key copied to clipboard!</p>
                      )}
                    </div>

                    <button
                      onClick={handleRegenerateApiKey}
                      disabled={regenerating}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                      <SafeIcon
                        icon={FiRefreshCw}
                        className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`}
                      />
                      <span>{regenerating ? 'Regenerating...' : 'Regenerate API Key'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <UserUsageStats userId={user.id} />
            )}
          </div>

          {/* Admin Section (only visible to admin users) */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <SafeIcon icon={FiShield} className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <SafeIcon icon={FiUsers} className="h-5 w-5 mr-2" />
                  User Management
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Admin Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <SafeIcon icon={FiUsers} className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-900">Total Users</p>
                      <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-900">Active Users</p>
                      <p className="text-2xl font-bold text-green-600">
                        {users.filter(u => u.is_active).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <SafeIcon icon={FiActivity} className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-900">Total API Calls</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {users.reduce((sum, u) => sum + u.usage.total_requests, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {loadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          API Usage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Request
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-xs text-gray-400">
                                  Joined {new Date(user.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={FiActivity} className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="font-medium">{user.usage.total_requests.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">
                                  {user.usage.this_month} this month
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              {user.usage.last_request ? (
                                <>
                                  <div>{new Date(user.usage.last_request).toLocaleDateString()}</div>
                                  <div className="text-xs text-gray-400">
                                    {new Date(user.usage.last_request).toLocaleTimeString()}
                                  </div>
                                </>
                              ) : (
                                <div className="text-gray-400">Never</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleToggleUserStatus(user.id, !user.is_active)}
                                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                  user.is_active
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                <SafeIcon 
                                  icon={user.is_active ? FiToggleRight : FiToggleLeft} 
                                  className="h-4 w-4 mr-1" 
                                />
                                {user.is_active ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                onClick={() => handleViewUserDetails(user)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title="View Details"
                              >
                                <SafeIcon icon={FiEye} className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredUsers.length === 0 && !loadingUsers && (
                <div className="text-center py-8">
                  <SafeIcon icon={FiUsers} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found matching your criteria.</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* User details modal */}
      <UserDetailsModal 
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={closeModal}
        onToggleUserStatus={handleToggleUserStatus}
      />
    </div>
  );
};

export default DashboardPage;