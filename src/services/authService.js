const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    // Try to extract error message from JSON response
    try {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    } catch (e) {
      // If JSON parsing fails, throw a generic error
      if (e instanceof SyntaxError) {
        throw new Error(`Network Error: ${response.status} ${response.statusText}`);
      }
      throw e;
    }
  }
  return response.json();
};

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return handleApiError(response);
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Server connection failed. Please make sure the backend server is running.');
      }
      throw error;
    }
  },

  async register(name, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      return handleApiError(response);
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Server connection failed. Please make sure the backend server is running.');
      }
      throw error;
    }
  },

  async getProfile(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleApiError(response);
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Server connection failed. Please make sure the backend server is running.');
      }
      throw error;
    }
  },

  async regenerateApiKey(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/regenerate-key`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleApiError(response);
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Server connection failed. Please make sure the backend server is running.');
      }
      throw error;
    }
  },
};