import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { conversionService } from '../services/conversionService';
import { API_CONFIG } from '../config/api';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTerminal, FiPlay, FiCopy, FiCheck, FiKey, FiTag, FiRefreshCw, FiArrowRight, FiArrowLeft } = FiIcons;

const TestConsolePage = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState(user?.api_key || '');
  const [apiVersion, setApiVersion] = useState(API_CONFIG.CURRENT_VERSION);
  const [conversionType, setConversionType] = useState('markdown_to_notion');
  const [markdown, setMarkdown] = useState(
    `# Sample Markdown
This is a **sample** markdown document with various elements:

## Features
- Regular bulleted item
- [ ] Unchecked task item
- [x] Completed task item
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

1. First numbered item
2. Second numbered item
3. Third numbered item

---

That's all!`
  );
  
  const [notionJson, setNotionJson] = useState(JSON.stringify({
    children: [
      {
        object: "block",
        type: "heading_1",
        heading_1: {
          rich_text: [
            {
              type: "text",
              text: { content: "Sample Notion JSON" }
            }
          ]
        }
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: "This is a " }
            },
            {
              type: "text",
              text: { content: "sample" },
              annotations: { bold: true }
            },
            {
              type: "text",
              text: { content: " document with various elements:" }
            }
          ]
        }
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: { content: "Features" }
            }
          ]
        }
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "Regular bulleted item" }
            }
          ]
        }
      },
      {
        object: "block",
        type: "to_do",
        to_do: {
          rich_text: [
            {
              type: "text",
              text: { content: "Unchecked task item" }
            }
          ],
          checked: false
        }
      },
      {
        object: "block",
        type: "to_do",
        to_do: {
          rich_text: [
            {
              type: "text",
              text: { content: "Completed task item" }
            }
          ],
          checked: true
        }
      }
    ]
  }, null, 2));
  
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (conversionType === 'markdown_to_notion') {
      if (!markdown.trim()) {
        setError('Please enter some markdown content');
        return;
      }
    } else {
      try {
        JSON.parse(notionJson);
      } catch (e) {
        setError('Invalid JSON format');
        return;
      }
    }
    
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      let result;
      
      if (conversionType === 'markdown_to_notion') {
        result = await conversionService.convertMarkdownToNotion(
          markdown,
          apiKey,
          apiVersion
        );
        setResponse(JSON.stringify(result, null, 2));
      } else {
        result = await conversionService.convertNotionToMarkdown(
          JSON.parse(notionJson),
          apiKey,
          apiVersion
        );
        setResponse(result.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const swapConversionType = () => {
    setConversionType(prevType => 
      prevType === 'markdown_to_notion' ? 'notion_to_markdown' : 'markdown_to_notion'
    );
    setResponse('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <SafeIcon icon={FiTerminal} className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Test Console</h1>
            </div>

            {/* API Configuration Section */}
            <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiKey} className="inline mr-2" /> API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiTag} className="inline mr-2" /> API Version
                </label>
                <select
                  value={apiVersion}
                  onChange={(e) => setApiVersion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {API_CONFIG.SUPPORTED_VERSIONS.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiRefreshCw} className="inline mr-2" /> Conversion Type
                </label>
                <div className="flex items-center">
                  <select
                    value={conversionType}
                    onChange={(e) => setConversionType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="markdown_to_notion">Markdown to Notion</option>
                    <option value="notion_to_markdown">Notion to Markdown</option>
                  </select>
                  <button
                    onClick={swapConversionType}
                    className="ml-2 p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    title="Swap conversion direction"
                  >
                    <SafeIcon 
                      icon={conversionType === 'markdown_to_notion' ? FiArrowRight : FiArrowLeft} 
                      className="h-5 w-5" 
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {conversionType === 'markdown_to_notion' 
                      ? 'Markdown Input' 
                      : 'Notion JSON Input'}
                  </h2>
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
                  value={conversionType === 'markdown_to_notion' ? markdown : notionJson}
                  onChange={(e) => {
                    if (conversionType === 'markdown_to_notion') {
                      setMarkdown(e.target.value);
                    } else {
                      setNotionJson(e.target.value);
                    }
                  }}
                  placeholder={conversionType === 'markdown_to_notion' 
                    ? "Enter your markdown content here..." 
                    : "Enter your Notion JSON here..."}
                  className="w-full h-64 sm:h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                
                <div className="mt-2 text-sm text-gray-500">
                  {conversionType === 'markdown_to_notion' 
                    ? `${markdown.length} characters` 
                    : `${notionJson.length} characters`}
                </div>
              </div>

              {/* Output Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {conversionType === 'markdown_to_notion' 
                      ? 'Notion JSON Output' 
                      : 'Markdown Output'}
                  </h2>
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
                
                <div className={`bg-gray-900 text-gray-100 rounded-md p-4 h-64 sm:h-96 overflow-y-auto ${
                  conversionType === 'markdown_to_notion' ? 'font-mono text-sm' : ''
                }`}>
                  {loading && (
                    <div className="flex items-center space-x-2 text-blue-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span>Converting...</span>
                    </div>
                  )}
                  
                  {error && (
                    <div className="text-red-400">
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                  
                  {response && (
                    conversionType === 'markdown_to_notion' 
                      ? (
                        <pre className="text-sm overflow-x-auto">
                          <code>{response}</code>
                        </pre>
                      ) : (
                        <div className="whitespace-pre-wrap">{response}</div>
                      )
                  )}
                  
                  {!loading && !error && !response && (
                    <div className="text-gray-400 text-sm">
                      Click "Convert" to see the {conversionType === 'markdown_to_notion' ? 'Notion JSON' : 'Markdown'} output here...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestConsolePage;