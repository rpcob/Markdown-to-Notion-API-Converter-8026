import { supabaseService } from './supabaseService';

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

export const conversionService = {
  async convertMarkdownToNotion(markdown, apiKey, backendType = 'express') {
    try {
      // If using Supabase, use the Supabase service
      if (backendType === 'supabase') {
        return await supabaseService.convertMarkdownToNotion(markdown, apiKey);
      }
      
      // Otherwise use the Express API
      const response = await fetch(`${API_BASE_URL}/convert/markdown-to-notion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ markdown }),
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