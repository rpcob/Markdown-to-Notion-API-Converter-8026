import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import UserDetailsModal from '../components/UserDetailsModal';
import AdminUserTable from '../components/AdminUserTable';
import PlanOverview from '../components/PlanOverview';
import UserUsageStats from '../components/UserUsageStats';
import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const {
  FiUser,
  FiUsers,
  FiActivity,
  FiAlertCircle,
  FiRefreshCw
} = FiIcons;

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalApiCalls: 0
  });

  const isAdmin = user?.email?.toLowerCase() === 'rpcob@yahoo.com';

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles_md2n')
        .select('*');

      if (profilesError) throw profilesError;

      // Get usage statistics for each user
      const usersWithStats = await Promise.all(
        profiles.map(async (profile) => {
          const { data: usage, error: usageError } = await supabase
            .from('conversions_md2n')
            .select('created_at')
            .eq('user_id', profile.id);

          if (usageError) console.error('Error fetching usage:', usageError);

          const today = new Date().toISOString().split('T')[0];
          const dailyRequests = usage?.filter(u => 
            u.created_at.startsWith(today)
          ).length || 0;

          return {
            ...profile,
            usage: {
              total_requests: usage?.length || 0,
              this_month: usage?.filter(u => 
                u.created_at.startsWith(new Date().toISOString().slice(0, 7))
              ).length || 0,
              today: dailyRequests,
              last_request: usage?.[usage.length - 1]?.created_at
            }
          };
        })
      );

      setUsers(usersWithStats);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles_md2n')
        .select('is_active');

      if (profilesError) throw profilesError;

      const { data: conversions, error: conversionsError } = await supabase
        .from('conversions_md2n')
        .select('id');

      if (conversionsError) throw conversionsError;

      setStats({
        totalUsers: profiles.length,
        activeUsers: profiles.filter(p => p.is_active).length,
        totalApiCalls: conversions.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) throw new Error('User not found');

      const { data, error } = await supabase
        .from('profiles_md2n')
        .update({ is_active: !userToUpdate.is_active })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === userId ? { ...u, is_active: !u.is_active } : u
        )
      );

      if (selectedUser?.id === userId) {
        setSelectedUser(prev => ({ ...prev, is_active: !prev.is_active }));
      }

      return data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw new Error('Failed to update user status');
    }
  };

  const handleUpdateUserPlan = async (userId, newPlan) => {
    try {
      const { data, error } = await supabase
        .from('profiles_md2n')
        .update({ plan: newPlan })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === userId ? { ...u, plan: newPlan } : u
        )
      );

      if (selectedUser?.id === userId) {
        setSelectedUser(prev => ({ ...prev, plan: newPlan }));
      }

      return data;
    } catch (error) {
      console.error('Error updating user plan:', error);
      throw new Error('Failed to update user plan');
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <PlanOverview
              plan={user?.plan || 'Free'}
              usage={{
                last15Min: 0,
                daily: 0
              }}
            />
            <div className="mt-8">
              <UserUsageStats userId={user?.id} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
              <SafeIcon icon={FiAlertCircle} className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <SafeIcon icon={FiUsers} className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <SafeIcon icon={FiUser} className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.activeUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                  <SafeIcon icon={FiActivity} className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total API Calls</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalApiCalls.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Users</h2>
              <button
                onClick={fetchUsers}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <SafeIcon icon={FiRefreshCw} className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>

            <AdminUserTable
              users={users}
              onToggleUserStatus={handleToggleUserStatus}
              onViewUserDetails={handleViewUserDetails}
            />
          </div>

          {/* User Details Modal */}
          <UserDetailsModal
            user={selectedUser}
            isOpen={isModalOpen}
            onClose={closeModal}
            onToggleUserStatus={handleToggleUserStatus}
            onUpdatePlan={handleUpdateUserPlan}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;