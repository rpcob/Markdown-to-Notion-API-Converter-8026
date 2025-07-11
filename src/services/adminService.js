import supabase from '../lib/supabase';

export const adminService = {
  // Check if user is admin
  isAdmin(userEmail) {
    return userEmail?.toLowerCase() === 'rpcob@yahoo.com';
  },

  // Get all users with their API usage
  async getAllUsers() {
    try {
      // In a real implementation, this would fetch from Supabase
      const { data: users, error } = await supabase
        .from('profiles')
        .select(`
          *,
          conversions(count)
        `);

      if (error) throw error;

      // Transform the data to include usage statistics
      return users.map(user => ({
        ...user,
        usage: {
          total_requests: user.conversions?.[0]?.count || 0,
          this_month: Math.floor(Math.random() * 100), // Mock data
          last_request: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Toggle user active status
  async toggleUserStatus(userId, isActive) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  // Get user statistics
  async getUserStats() {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, is_active');

      if (error) throw error;

      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.is_active).length;

      // Get total API calls
      const { data: conversions, error: conversionError } = await supabase
        .from('conversions')
        .select('id');

      if (conversionError) throw conversionError;

      return {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalApiCalls: conversions.length
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
};