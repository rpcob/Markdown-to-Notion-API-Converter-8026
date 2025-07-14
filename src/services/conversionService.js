import supabase from '../lib/supabase';

export const conversionService = {
  async convertMarkdownToNotion(markdown, apiKey, version = 'v1') {
    if (!markdown || !apiKey) {
      throw new Error('Markdown content and API key are required');
    }

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

      // For now, we'll use a client-side converter function
      // In a production app, you'd use a Supabase RPC function for this
      const blocks = this.generateNotionBlocks(markdown);

      // Log the conversion in the database
      try {
        const { error: logError } = await supabase
          .from('conversions')
          .insert([
            {
              user_id: userData.id,
              input_size: markdown.length,
              block_count: blocks.length,
              conversion_type: 'markdown_to_notion',
              api_version: version || 'v1'
            }
          ]);

        if (logError) {
          console.error('Error logging conversion:', logError);
        }
      } catch (logErr) {
        console.error('Conversion logging failed:', logErr);
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
  },

  async convertNotionToMarkdown(notionJson, apiKey, version = 'v1') {
    if (!notionJson || !apiKey) {
      throw new Error('Notion JSON and API key are required');
    }

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

      // For now, we'll use a simple client-side converter function
      // In a production app, you'd use a Supabase RPC function for this
      const markdown = this.generateMarkdown(notionJson);

      // Log the conversion in the database
      try {
        const blockCount = notionJson.children ? notionJson.children.length : 0;
        const { error: logError } = await supabase
          .from('conversions')
          .insert([
            {
              user_id: userData.id,
              input_size: JSON.stringify(notionJson).length,
              block_count: blockCount,
              conversion_type: 'notion_to_markdown',
              api_version: version || 'v1'
            }
          ]);

        if (logError) {
          console.error('Error logging conversion:', logError);
        }
      } catch (logErr) {
        console.error('Conversion logging failed:', logErr);
      }

      return {
        success: true,
        data: markdown,
        metadata: {
          processedAt: new Date().toISOString(),
          userId: userData.id,
          version
        }
      };
    } catch (error) {
      console.error('Conversion error:', error);
      throw error;
    }
  },

  // Simple mock block generator for client-side conversion
  generateNotionBlocks(markdown) {
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
      } else if (line.startsWith('- [ ] ')) {
        blocks.push({
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: line.substring(6) } }],
            checked: false
          }
        });
      } else if (line.startsWith('- [x] ')) {
        blocks.push({
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: line.substring(6) } }],
            checked: true
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
      } else {
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
  },

  // Simple converter for Notion JSON to Markdown
  generateMarkdown(notionJson) {
    if (!notionJson.children || !Array.isArray(notionJson.children)) {
      return '';
    }

    let markdown = '';
    
    for (const block of notionJson.children) {
      switch (block.type) {
        case 'heading_1':
          markdown += `# ${this.extractTextContent(block.heading_1?.rich_text)}\n\n`;
          break;
        case 'heading_2':
          markdown += `## ${this.extractTextContent(block.heading_2?.rich_text)}\n\n`;
          break;
        case 'heading_3':
          markdown += `### ${this.extractTextContent(block.heading_3?.rich_text)}\n\n`;
          break;
        case 'paragraph':
          markdown += `${this.extractTextContent(block.paragraph?.rich_text)}\n\n`;
          break;
        case 'bulleted_list_item':
          markdown += `- ${this.extractTextContent(block.bulleted_list_item?.rich_text)}\n`;
          break;
        case 'numbered_list_item':
          markdown += `1. ${this.extractTextContent(block.numbered_list_item?.rich_text)}\n`;
          break;
        case 'to_do':
          const checked = block.to_do?.checked;
          markdown += `- [${checked ? 'x' : ' '}] ${this.extractTextContent(block.to_do?.rich_text)}\n`;
          break;
        case 'code':
          const language = block.code?.language || '';
          markdown += `\`\`\`${language}\n${this.extractTextContent(block.code?.rich_text)}\n\`\`\`\n\n`;
          break;
        case 'quote':
          markdown += `> ${this.extractTextContent(block.quote?.rich_text)}\n\n`;
          break;
        case 'divider':
          markdown += `---\n\n`;
          break;
        default:
          markdown += `Unsupported block type: ${block.type}\n\n`;
      }
    }
    
    return markdown;
  },

  // Helper to extract text content from rich text arrays
  extractTextContent(richTextArray) {
    if (!richTextArray || !Array.isArray(richTextArray) || richTextArray.length === 0) {
      return '';
    }
    
    return richTextArray.map(textObj => textObj.text?.content || '').join('');
  }
};