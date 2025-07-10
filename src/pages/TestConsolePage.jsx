import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { conversionService } from '../services/conversionService';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTerminal, FiPlay, FiCopy, FiCheck, FiAlertTriangle } = FiIcons;

const TestConsolePage = () => {
  const { user, isDemo, backendType } = useAuth();
  const [markdown, setMarkdown] = useState(`# Sample Markdown

This is a **sample** markdown document with various elements:

## Features

- Headings (H1-H6)
- **Bold** and *italic* text
- \`Inline code\`
- Lists (bulleted and numbered)

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> This is a blockquote

---

That's all!`);
  
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!markdown.trim()) {
      setError('Please enter some markdown content');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      if (isDemo) {
        // In demo mode, generate a mock response
        await mockConversion();
      } else {
        // In real mode, call the API with the correct backend type
        const result = await conversionService.convertMarkdownToNotion(
          markdown, 
          user?.apiKey,
          backendType
        );
        setResponse(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock conversion for demo mode
  const mockConversion = () => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Generate a mock response based on the markdown
        const mockResponse = {
          success: true,
          data: {
            children: generateMockBlocks(markdown)
          },
          metadata: {
            blockCount: countBlocks(markdown),
            processedAt: new Date().toISOString(),
            userId: user?.id || 'demo-user'
          }
        };
        
        setResponse(JSON.stringify(mockResponse, null, 2));
        resolve();
      }, 1000);
    });
  };

  // Simple mock block generator
  const generateMockBlocks = (markdown) => {
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
  };

  // Count blocks for metadata
  const countBlocks = (markdown) => {
    return markdown.split('\n').filter(line => line.trim()).length;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiTerminal} className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Test Console</h1>
            </div>

            {isDemo && (
              <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <SafeIcon icon={FiAlertTriangle} className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Demo Mode Active.</strong> You're using the application in demo mode.
                    </p>
                    <p className="mt-1 text-sm text-yellow-700">
                      Conversions will be simulated and no actual API calls will be made.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Markdown Input</h2>
                  <button
                    onClick={handleConvert}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <SafeIcon icon={FiPlay} className="h-4 w-4" />
                    <span>{loading ? 'Converting...' : 'Convert'}</span>
                  </button>
                </div>
                
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Enter your markdown content here..."
                  className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                
                <div className="mt-2 text-sm text-gray-500">
                  {markdown.length} / 50,000 characters
                </div>
              </div>

              {/* Output Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Notion JSON Output</h2>
                  {response && (
                    <button
                      onClick={() => copyToClipboard(response)}
                      className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <SafeIcon icon={copied ? FiCheck : FiCopy} className="h-4 w-4" />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                <div className="bg-gray-900 text-gray-100 rounded-md p-4 h-96 overflow-y-auto">
                  {loading && (
                    <div className="flex items-center space-x-2 text-blue-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span>Converting markdown...</span>
                    </div>
                  )}
                  
                  {error && (
                    <div className="text-red-400">
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                  
                  {response && (
                    <pre className="text-sm">
                      <code>{response}</code>
                    </pre>
                  )}
                  
                  {!loading && !error && !response && (
                    <div className="text-gray-400 text-sm">
                      Click "Convert" to see the Notion JSON output here...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Tips</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Use the sample markdown above as a starting point</li>
                <li>• The output JSON can be directly used with the Notion API</li>
                <li>• Large content is automatically split into multiple blocks</li>
                <li>• All common markdown elements are supported</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestConsolePage;