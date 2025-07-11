-- Add plan column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'Free';

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_created 
ON rate_limits(user_id, created_at);

-- Create policy for rate limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limits"
ON rate_limits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rate limits"
ON rate_limits FOR INSERT
WITH CHECK (auth.uid() = user_id);