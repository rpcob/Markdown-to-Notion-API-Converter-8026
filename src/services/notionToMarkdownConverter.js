export class NotionToMarkdownConverter {
  constructor() {
    // Initialize any configuration here
  }

  convert(notionData) {
    if (!notionData || !notionData.children || !Array.isArray(notionData.children)) {
      return '';
    }

    return this.processBlocks(notionData.children);
  }

  processBlocks(blocks) {
    let markdown = '';
    
    for (const block of blocks) {
      switch (block.type) {
        case 'heading_1':
          markdown += `# ${this.extractTextContent(block.heading_1.rich_text)}\n\n`;
          break;
        
        case 'heading_2':
          markdown += `## ${this.extractTextContent(block.heading_2.rich_text)}\n\n`;
          break;
        
        case 'heading_3':
          markdown += `### ${this.extractTextContent(block.heading_3.rich_text)}\n\n`;
          break;
        
        case 'paragraph':
          const paragraphText = this.extractTextContent(block.paragraph.rich_text);
          if (paragraphText) {
            markdown += `${paragraphText}\n\n`;
          }
          break;
        
        case 'bulleted_list_item':
          markdown += `- ${this.extractTextContent(block.bulleted_list_item.rich_text)}\n`;
          break;
        
        case 'numbered_list_item':
          markdown += `1. ${this.extractTextContent(block.numbered_list_item.rich_text)}\n`;
          break;
        
        case 'to_do':
          const checked = block.to_do.checked;
          markdown += `- [${checked ? 'x' : ' '}] ${this.extractTextContent(block.to_do.rich_text)}\n`;
          break;
        
        case 'code':
          const language = block.code.language || '';
          markdown += `\`\`\`${language}\n${this.extractTextContent(block.code.rich_text)}\n\`\`\`\n\n`;
          break;
        
        case 'quote':
          markdown += `> ${this.extractTextContent(block.quote.rich_text)}\n\n`;
          break;
        
        case 'divider':
          markdown += `---\n\n`;
          break;
        
        default:
          // Handle unsupported block types
          markdown += `Unsupported block type: ${block.type}\n\n`;
      }
    }
    
    return markdown;
  }

  extractTextContent(richTextArray) {
    if (!richTextArray || !Array.isArray(richTextArray) || richTextArray.length === 0) {
      return '';
    }
    
    return richTextArray.map(textObj => {
      let content = textObj.text.content;
      
      // Apply formatting based on annotations
      if (textObj.annotations) {
        if (textObj.annotations.code) {
          content = `\`${content}\``;
        }
        if (textObj.annotations.bold) {
          content = `**${content}**`;
        }
        if (textObj.annotations.italic) {
          content = `*${content}*`;
        }
        // Add more formatting as needed: strikethrough, underline, etc.
      }
      
      // Handle links
      if (textObj.text.link) {
        content = `[${content}](${textObj.text.link.url})`;
      }
      
      return content;
    }).join('');
  }
}