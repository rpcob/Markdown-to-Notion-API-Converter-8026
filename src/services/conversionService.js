import supabase from '../lib/supabase';
import { getApiUrl } from '../config/api';

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

      // Use the generateMockBlocks function
      const blocks = generateMockBlocks(markdown);

      // Log the conversion
      const { error: logError } = await supabase
        .from('conversions')
        .insert([
          {
            user_id: userData.id,
            input_size: markdown.length,
            block_count: blocks.length,
            api_version: version
          }
        ]);

      if (logError) {
        console.error('Error logging conversion:', logError);
      }

      return {
        success: true,
        data: {
          children: blocks
        },
        metadata: {
          blockCount: blocks.length,
          processedAt: new Date().toISOString(),
          userId: userData.id,
          version
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