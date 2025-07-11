import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import UsageChart from './UsageChart';
import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiActivity, FiClock, FiCalendar, FiBarChart2 } = FiIcons;

const UserUsageStats = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usageData, setUsageData] = useState(null);
  
  useEffect(() => {
    const fetchUsageData = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user's usage statistics
        const { data: usageStats, error: usageError } = await supabase
          .from('usage_statistics_qw78x2')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (usageError) throw usageError;
        
        // Get monthly requests using the custom function
        const { data: monthlyData, error: monthlyError } = await supabase
          .rpc('get_monthly_requests', { user_uuid: userId });
          
        if (monthlyError) throw monthlyError;
        
        // Get today's requests count
        const today = new Date().toISOString().split('T')[0];
        const todayCount = usageStats?.daily_requests?.[today] || 0;
        
        // Format the data
        const formattedData = {
          total_requests: usageStats?.requests_count || 0,
          this_month: monthlyData || 0,
          today: todayCount,
          last_request: usageStats?.last_request,
          daily_requests: usageStats?.daily_requests || {}
        };
        
        setUsageData(formattedData);
      } catch (err) {
        console.error('Error fetching usage data:', err);
        setError('Failed to load usage statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsageData();
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }
  
  // Format daily data for chart
  const dailyData = usageData?.daily_requests 
    ? Object.entries(usageData.daily_requests)
        .sort((a, b) => a[0].localeCompare(b[0])) // Sort by date
        .map(([date, count]) => ({ date, count: Number(count) }))
    : [];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <SafeIcon icon={FiActivity} className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">Total Requests</p>
              <p className="text-2xl font-bold text-blue-600">
                {usageData?.total_requests?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <SafeIcon icon={FiCalendar} className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-900">This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {usageData?.this_month?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <SafeIcon icon={FiClock} className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-900">Today</p>
              <p className="text-2xl font-bold text-purple-600">
                {usageData?.today?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Last request: {usageData?.last_request 
                  ? new Date(usageData.last_request).toLocaleString() 
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <SafeIcon icon={FiBarChart2} className="h-5 w-5 mr-2" />
          Usage Over Time
        </h3>
        
        {dailyData.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-64 bg-white rounded-lg border border-gray-200 p-4"
          >
            <UsageChart data={dailyData} />
          </motion.div>
        ) : (
          <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">No usage data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserUsageStats;