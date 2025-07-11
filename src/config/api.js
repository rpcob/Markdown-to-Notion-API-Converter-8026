// API Configuration
export const API_CONFIG = {
  // This is your frontend URL where the app is hosted
  FRONTEND_URL: 'https://relaxed-queijadas-f47dc1.netlify.app',
  // Your Supabase project URL serves as your API
  BASE_URL: 'https://yhcxnmmxecbsddyhxiff.supabase.co',
  CURRENT_VERSION: 'v1',
  SUPPORTED_VERSIONS: ['v1']
};

// The API is handled directly through Supabase client
// This function is kept for compatibility with existing code
export const getApiUrl = (version = API_CONFIG.CURRENT_VERSION) => {
  return `${API_CONFIG.BASE_URL}/rest/v1/rpc`;
};