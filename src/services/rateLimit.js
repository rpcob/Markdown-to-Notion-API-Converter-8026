export const RATE_LIMITS = {
  Free: { rate: 10, daily: 100 },
  Lite: { rate: 500, daily: 5000 },
  Pro: { rate: 2000, daily: 25000 },
  Enterprise: { rate: Infinity, daily: Infinity }
};

export const checkRateLimit = async (userId, supabase) => {
  try {
    // Get user's plan
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    const plan = profile.plan || 'Free';
    const limits = RATE_LIMITS[plan];

    // Get usage statistics
    const now = new Date();
    const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000);
    const startOfDay = new Date(now.setHours(0,0,0,0));

    const { data: usage, error: usageError } = await supabase
      .from('conversions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', startOfDay.toISOString());

    if (usageError) throw usageError;

    const last15MinCount = usage.filter(u => 
      new Date(u.created_at) >= fifteenMinutesAgo
    ).length;

    const dailyCount = usage.length;

    // Check if limits are exceeded
    if (last15MinCount >= limits.rate) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (dailyCount >= limits.daily) {
      throw new Error('Daily limit exceeded. Please try again tomorrow.');
    }

    return {
      allowed: true,
      remaining: {
        rate: limits.rate - last15MinCount,
        daily: limits.daily - dailyCount
      }
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    throw error;
  }
};