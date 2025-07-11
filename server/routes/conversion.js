import express from 'express';
import { marked } from 'marked';
import { authenticateApiKey } from '../middleware/auth.js';
import { MarkdownToNotionConverter } from '../services/markdownToNotionConverter.js';

const router = express.Router();
const converter = new MarkdownToNotionConverter();

// Convert markdown to Notion format
router.post('/markdown-to-notion', authenticateApiKey, async (req, res) => {
  try {
    const { markdown } = req.body;

    if (!markdown || typeof markdown !== 'string') {
      return res.status(400).json({ error: 'Markdown content is required and must be a string' });
    }

    // Convert markdown to Notion format
    const notionBlocks = converter.convert(markdown);
    
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

export { router as conversionRoutes };