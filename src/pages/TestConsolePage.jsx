import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { conversionService } from '../services/conversionService';
import { API_CONFIG } from '../config/api';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTerminal, FiPlay, FiCopy, FiCheck, FiKey, FiTag } = FiIcons;

const TestConsolePage = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState(user?.api_key || '');
  const [apiVersion, setApiVersion] = useState(API_CONFIG.CURRENT_VERSION);
  const [markdown, setMarkdown] = useState(
    `# Sample Markdown
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
That's all!`
  );
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!markdown.trim()) {
      setError('Please enter some markdown content');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await conversionService.convertMarkdownToNotion(
        markdown,
        apiKey,
        apiVersion
      );
      setResponse(JSON.stringify(result, null, 2));
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

            {/* API Configuration Section */}
            <div className="mb-6 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiKey} className="inline mr-2" />
                  API Key
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
                  <SafeIcon icon={FiTag} className="inline mr-2" />
                  API Version
                </label>
                <select
                  value={apiVersion}
                  onChange={(e) => setApiVersion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {API_CONFIG.SUPPORTED_VERSIONS.map(version => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                  {markdown.length} characters
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestConsolePage;