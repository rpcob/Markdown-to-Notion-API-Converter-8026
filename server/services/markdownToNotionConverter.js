import { marked } from 'marked';

export class MarkdownToNotionConverter {
  constructor() {
    this.renderer = new marked.Renderer();
    this.setupRenderer();
  }

  setupRenderer() {
    // Override renderer methods to capture tokens
    this.renderer.heading = (text, level) => ({ type: 'heading', level, text });
    this.renderer.paragraph = (text) => ({ type: 'paragraph', text });
    this.renderer.list = (body, ordered) => ({ type: 'list', ordered, items: body });
    this.renderer.listitem = (text) => ({ type: 'listitem', text });
  }

  convert(markdown) {
    const tokens = marked.lexer(markdown);
    return this.processTokens(tokens);
  }

  processTokens(tokens) {
    const blocks = [];

    for (const token of tokens) {
      switch (token.type) {
        case 'heading':
          blocks.push(...this.createHeadingBlocks(token));
          break;
        case 'paragraph':
          blocks.push(...this.createParagraphBlocks(token));
          break;
        case 'list':
          blocks.push(...this.createListBlocks(token));
          break;
        case 'blockquote':
          blocks.push(...this.createQuoteBlocks(token));
          break;
        case 'code':
          blocks.push(...this.createCodeBlocks(token));
          break;
        case 'hr':
          blocks.push(this.createDividerBlock());
          break;
        default:
          // Handle other token types as paragraphs
          if (token.raw && token.raw.trim()) {
            blocks.push(...this.createParagraphBlocks({
              text: token.raw,
              tokens: [{ type: 'text', raw: token.raw }]
            }));
          }
      }
    }

    return blocks;
  }

  // Helper function to split text at word boundaries
  splitTextAtWordBoundary(text, maxLength = 2000) {
    if (text.length <= maxLength) {
      return [text];
    }

    const chunks = [];
    let currentText = text;

    while (currentText.length > maxLength) {
      let splitIndex = maxLength;
      
      // Find the last space before the limit to avoid splitting words
      while (splitIndex > 0 && currentText[splitIndex] !== ' ' && currentText[splitIndex] !== '\n') {
        splitIndex--;
      }
      
      // If no space found, split at the limit (edge case for very long words)
      if (splitIndex === 0) {
        splitIndex = maxLength;
      }
      
      chunks.push(currentText.substring(0, splitIndex).trim());
      currentText = currentText.substring(splitIndex).trim();
    }

    if (currentText.length > 0) {
      chunks.push(currentText);
    }

    return chunks;
  }

  // Helper function to split rich text array to respect character limits
  splitRichTextByCharLimit(richText, limit = 2000) {
    const chunks = [];
    let currentChunk = [];
    let currentLength = 0;

    for (const textObj of richText) {
      const content = textObj.text.content;
      const contentLength = content.length;

      if (currentLength + contentLength <= limit) {
        currentChunk.push(textObj);
        currentLength += contentLength;
      } else {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = [];
          currentLength = 0;
        }

        // If single text object exceeds limit, split it
        if (contentLength > limit) {
          const splitTexts = this.splitTextContent(textObj, limit);
          for (const splitText of splitTexts) {
            chunks.push([splitText]);
          }
        } else {
          currentChunk.push(textObj);
          currentLength = contentLength;
        }
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  // Helper function to split individual text content at word boundaries
  splitTextContent(textObj, limit) {
    const content = textObj.text.content;
    const chunks = this.splitTextAtWordBoundary(content, limit);
    
    return chunks.map(chunk => ({
      ...textObj,
      text: {
        ...textObj.text,
        content: chunk
      }
    }));
  }

  createHeadingBlocks(token) {
    const headingType = `heading_${token.depth}`;
    const richText = this.parseInlineTokens(token.tokens || [{ type: 'text', raw: token.text }]);
    const richTextChunks = this.splitRichTextByCharLimit(richText, 2000);
    
    return richTextChunks.map(chunk => ({
      object: 'block',
      type: headingType,
      [headingType]: {
        rich_text: chunk
      }
    }));
  }

  createParagraphBlocks(token) {
    const richText = this.parseInlineTokens(token.tokens || []);
    const blocks = [];

    if (richText.length === 0) {
      return blocks;
    }

    // Split into multiple blocks if content exceeds character limits
    const chunks = this.splitRichTextByCharLimit(richText, 2000);
    
    for (const chunk of chunks) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: chunk
        }
      });
    }

    return blocks;
  }

  createListBlocks(token) {
    const blocks = [];
    const listType = token.ordered ? 'numbered_list_item' : 'bulleted_list_item';

    for (const item of token.items) {
      // Check if this is a task list item
      const itemText = item.text || '';
      const isTaskItem = itemText.match(/^\s*\[([ xX])\]\s*(.*)/);
      
      if (isTaskItem) {
        const isChecked = isTaskItem[1].toLowerCase() === 'x';
        const taskContent = isTaskItem[2];
        const richText = this.parseInlineTokens([{ type: 'text', raw: taskContent }]);
        const chunks = this.splitRichTextByCharLimit(richText, 2000);
        
        for (const chunk of chunks) {
          blocks.push({
            object: 'block',
            type: 'to_do',
            to_do: {
              rich_text: chunk,
              checked: isChecked
            }
          });
        }
      } else {
        const richText = this.parseInlineTokens(item.tokens || []);
        const chunks = this.splitRichTextByCharLimit(richText, 2000);
        
        for (const chunk of chunks) {
          blocks.push({
            object: 'block',
            type: listType,
            [listType]: {
              rich_text: chunk
            }
          });
        }
      }
    }

    return blocks;
  }

  createQuoteBlocks(token) {
    const blocks = [];
    const richText = this.parseInlineTokens(token.tokens || []);
    const chunks = this.splitRichTextByCharLimit(richText, 2000);
    
    for (const chunk of chunks) {
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: chunk
        }
      });
    }

    return blocks;
  }

  createCodeBlocks(token) {
    const blocks = [];
    const codeChunks = this.splitTextAtWordBoundary(token.text, 2000);
    
    for (const chunk of codeChunks) {
      blocks.push({
        object: 'block',
        type: 'code',
        code: {
          rich_text: [{ type: 'text', text: { content: chunk } }],
          language: token.lang || 'plain text'
        }
      });
    }

    return blocks;
  }

  createDividerBlock() {
    return {
      object: 'block',
      type: 'divider',
      divider: {}
    };
  }

  parseInlineTokens(tokens) {
    const richText = [];

    for (const token of tokens) {
      switch (token.type) {
        case 'text':
          richText.push({
            type: 'text',
            text: { content: token.text || token.raw }
          });
          break;
        case 'strong':
          richText.push({
            type: 'text',
            text: { content: token.text },
            annotations: { bold: true }
          });
          break;
        case 'em':
          richText.push({
            type: 'text',
            text: { content: token.text },
            annotations: { italic: true }
          });
          break;
        case 'code':
          richText.push({
            type: 'text',
            text: { content: token.text },
            annotations: { code: true }
          });
          break;
        case 'link':
          richText.push({
            type: 'text',
            text: {
              content: token.text,
              link: { url: token.href }
            }
          });
          break;
        default:
          if (token.raw) {
            richText.push({
              type: 'text',
              text: { content: token.raw }
            });
          }
      }
    }

    return richText;
  }
}