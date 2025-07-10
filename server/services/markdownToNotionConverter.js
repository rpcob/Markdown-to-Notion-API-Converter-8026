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
          blocks.push(this.createHeadingBlock(token));
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
          blocks.push(this.createCodeBlock(token));
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

  createHeadingBlock(token) {
    const headingType = `heading_${token.depth}`;
    const richText = this.parseInlineTokens(token.tokens || [{ type: 'text', raw: token.text }]);

    return {
      object: 'block',
      type: headingType,
      [headingType]: {
        rich_text: richText
      }
    };
  }

  createParagraphBlocks(token) {
    const richText = this.parseInlineTokens(token.tokens || []);
    const blocks = [];

    if (richText.length === 0) {
      return blocks;
    }

    // Split into multiple blocks if content exceeds 2000 characters
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

  createCodeBlock(token) {
    return {
      object: 'block',
      type: 'code',
      code: {
        rich_text: [{
          type: 'text',
          text: {
            content: token.text
          }
        }],
        language: token.lang || 'plain text'
      }
    };
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
            text: {
              content: token.text || token.raw
            }
          });
          break;
        case 'strong':
          richText.push({
            type: 'text',
            text: {
              content: token.text
            },
            annotations: {
              bold: true
            }
          });
          break;
        case 'em':
          richText.push({
            type: 'text',
            text: {
              content: token.text
            },
            annotations: {
              italic: true
            }
          });
          break;
        case 'code':
          richText.push({
            type: 'text',
            text: {
              content: token.text
            },
            annotations: {
              code: true
            }
          });
          break;
        case 'link':
          richText.push({
            type: 'text',
            text: {
              content: token.text,
              link: {
                url: token.href
              }
            }
          });
          break;
        default:
          if (token.raw) {
            richText.push({
              type: 'text',
              text: {
                content: token.raw
              }
            });
          }
      }
    }

    return richText;
  }

  splitRichTextByCharLimit(richText, limit) {
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

  splitTextContent(textObj, limit) {
    const content = textObj.text.content;
    const chunks = [];
    let start = 0;

    while (start < content.length) {
      const end = Math.min(start + limit, content.length);
      const chunk = content.substring(start, end);
      
      chunks.push({
        ...textObj,
        text: {
          ...textObj.text,
          content: chunk
        }
      });

      start = end;
    }

    return chunks;
  }
}