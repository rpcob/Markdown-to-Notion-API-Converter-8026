import supabase from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const supabaseService = {
  // Authentication services
  async register(name, email, password) {
    try {
      // First register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw new Error(authError.message);
      
      // Generate API key
      const apiKey = uuidv4();
      
      // Then create a profile in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id,
            name,
            email,
            api_key: apiKey,
          }
        ]);
      
      if (profileError) throw new Error(profileError.message);
      
      return {
        token: authData.session.access_token,
        user: {
          id: authData.user.id,
          email,
          name,
          apiKey,
          createdAt: new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  async login(email, password) {
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw new Error(authError.message);
      
      // Get the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) throw new Error(profileError.message);
      
      return {
        token: authData.session.access_token,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: profileData.name,
          apiKey: profileData.api_key,
          createdAt: authData.user.created_at,
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  async getProfile() {
    try {
      // Get the current user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('Not authenticated');
      
      // Get the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) throw new Error(profileError.message);
      
      return {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: profileData.name,
          apiKey: profileData.api_key,
          createdAt: authData.user.created_at,
        }
      };
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  async regenerateApiKey() {
    try {
      // Get the current user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('Not authenticated');
      
      // Generate a new API key
      const newApiKey = uuidv4();
      
      // Update the user's API key
      const { data, error } = await supabase
        .from('profiles')
        .update({ api_key: newApiKey })
        .eq('id', authData.user.id);
      
      if (error) throw new Error(error.message);
      
      return { apiKey: newApiKey };
    } catch (error) {
      console.error('Regenerate API key error:', error);
      throw error;
    }
  },
  
  // Conversion service
  async convertMarkdownToNotion(markdown, apiKey) {
    try {
      // Validate the API key
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('api_key', apiKey)
        .single();
      
      if (userError || !userData) {
        throw new Error('Invalid API key');
      }
      
      // For now, we'll use the client-side converter
      // In a production app, you'd use a Supabase Edge Function for this
      const blocks = generateMockBlocks(markdown);
      
      // Log the conversion in the database
      const { error: logError } = await supabase
        .from('conversions')
        .insert([{
          user_id: userData.id,
          input_size: markdown.length,
          block_count: blocks.length,
        }]);
      
      if (logError) console.error('Error logging conversion:', logError);
      
      return {
        success: true,
        data: {
          children: blocks
        },
        metadata: {
          blockCount: blocks.length,
          processedAt: new Date().toISOString(),
          userId: userData.id
        }
      };
    } catch (error) {
      console.error('Conversion error:', error);
      throw error;
    }
  }
};

// Simple mock block generator for client-side conversion
function generateMockBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: line.substring(2) } }]
        }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: line.substring(3) } }]
        }
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: line.substring(4) } }]
        }
      });
    } else if (line.startsWith('- ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: line.substring(2) } }]
        }
      });
    } else if (line.startsWith('> ')) {
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ type: 'text', text: { content: line.substring(2) } }]
        }
      });
    } else if (line === '---') {
      blocks.push({
        object: 'block',
        type: 'divider',
        divider: {}
      });
    } else if (!blocks[blocks.length - 1] || blocks[blocks.length - 1].type !== 'paragraph') {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: line } }]
        }
      });
    }
  }
  
  return blocks;
}