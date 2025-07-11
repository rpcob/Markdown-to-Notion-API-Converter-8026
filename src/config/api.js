// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  CURRENT_VERSION: 'v1',
  SUPPORTED_VERSIONS: ['v1']
};

export const getApiUrl = (version = API_CONFIG.CURRENT_VERSION) => {
  return `${API_CONFIG.BASE_URL}/api/${version}`;
};