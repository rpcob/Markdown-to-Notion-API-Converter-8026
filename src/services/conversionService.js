// Add this to the existing convertMarkdownToNotion function
export const conversionService = {
  async convertMarkdownToNotion(markdown, apiKey, version) {
    try {
      if (!apiKey) {
        throw new Error('API key is required');
      }

      // First validate the API key
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('api_key', apiKey)
        .single();

      if (userError || !userData) {
        throw new Error('Invalid API key');
      }

      // Check rate limits
      const rateLimitCheck = await checkRateLimit(userData.id, supabase);
      if (!rateLimitCheck.allowed) {
        throw new Error(rateLimitCheck.message);
      }

      // Rest of the existing conversion logic...
      
    } catch (error) {
      console.error('Conversion error:', error);
      throw error;
    }
  }
  // ... rest of the service methods
};