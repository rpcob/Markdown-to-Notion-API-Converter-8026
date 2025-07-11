import express from 'express';
import { marked } from 'marked';
import { authenticateApiKey } from '../middleware/auth.js';
import { MarkdownToNotionConverter } from '../services/markdownToNotionConverter.js';
import { NotionToMarkdownConverter } from '../services/notionToMarkdownConverter.js';

const router = express.Router();
const mdToNotionConverter = new MarkdownToNotionConverter();
const notionToMdConverter = new NotionToMarkdownConverter();

// Convert markdown to Notion format
router.post('/markdown-to-notion', authenticateApiKey, async (req, res) => {
  try {
    const { markdown } = req.body;
    
    if (!markdown || typeof markdown !== 'string') {
      return res.status(400).json({
        error: 'Markdown content is required and must be a string'
      });
    }

    // Convert markdown to Notion format
    const notionBlocks = mdToNotionConverter.convert(markdown);

    res.json({
      success: true,
      data: {
        children: notionBlocks
      },
      metadata: {
        blockCount: notionBlocks.length,
        processedAt: new Date().toISOString(),
        userId: req.user.id
      }
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({
      error: 'Failed to convert markdown to Notion format',
      details: error.message
    });
  }
});

// Convert Notion format to markdown
router.post('/notion-to-markdown', authenticateApiKey, async (req, res) => {
  try {
    const { notion } = req.body;
    
    if (!notion || typeof notion !== 'object') {
      return res.status(400).json({
        error: 'Notion content is required and must be a valid JSON object'
      });
    }

    // Convert Notion format to markdown
    const markdown = notionToMdConverter.convert(notion);

    res.json({
      success: true,
      data: markdown,
      metadata: {
        processedAt: new Date().toISOString(),
        userId: req.user.id
      }
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({
      error: 'Failed to convert Notion format to markdown',
      details: error.message
    });
  }
});

export { router as conversionRoutes };