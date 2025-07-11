import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { API_CONFIG, getApiUrl } from '../config/api';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiCode, FiKey, FiZap, FiShield, FiCheck, FiInfo, FiChevronDown, FiArrowRight, FiAlertCircle, FiClock, FiActivity } = FiIcons;

const DocumentationPage = () => {
  const [selectedVersion, setSelectedVersion] = useState(API_CONFIG.CURRENT_VERSION);
  const baseUrl = getApiUrl(selectedVersion);
  
  const codeExample = `// Example: Convert Markdown to Notion
const response = await fetch('${baseUrl}/convert/markdown-to-notion', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key-here',
    'X-API-Version': '${selectedVersion}'
  },
  body: JSON.stringify({
    markdown: \`# My Document
This is a **sample** markdown document with:
- Lists
- **Bold text**
- \`inline code\`

## Code Block
\`\`\`javascript
console.log("Hello, World!");
\`\`\`
\`
  })
});

const result = await response.json();
console.log(result.data.children); // Notion blocks array`;

  const nodeExample = `// Node.js Example
const fetch = require('node-fetch');

async function convertMarkdown(markdown) {
  try {
    const response = await fetch('${baseUrl}/convert/markdown-to-notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NOTION_API_KEY,
        'X-API-Version': '${selectedVersion}'
      },
      body: JSON.stringify({ markdown })
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const result = await response.json();
    return result.data.children;
  } catch (error) {
    console.error('Conversion failed:', error);
    throw error;
  }
}`;

  const pythonExample = `# Python Example
import requests
import json

def convert_markdown(markdown, api_key):
    url = '${baseUrl}/convert/markdown-to-notion'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': api_key,
        'X-API-Version': '${selectedVersion}'
    }
    data = {'markdown': markdown}
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()['data']['children']
    else:
        raise Exception(f'API request failed: {response.status_code}')`;

  const curlExample = `# cURL Example
curl -X POST '${baseUrl}/convert/markdown-to-notion' \\
  -H 'Content-Type: application/json' \\
  -H 'X-API-Key: your-api-key-here' \\
  -H 'X-API-Version: ${selectedVersion}' \\
  -d '{
    "markdown": "# Hello World\\n\\nThis is a **sample** markdown."
  }'`;

  const responseExample = `{
  "success": true,
  "data": {
    "children": [
      {
        "object": "block",
        "type": "heading_1",
        "heading_1": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Hello World"
              }
            }
          ]
        }
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "This is a "
              }
            },
            {
              "type": "text",
              "text": {
                "content": "sample"
              },
              "annotations": {
                "bold": true
              }
            },
            {
              "type": "text",
              "text": {
                "content": " markdown."
              }
            }
          ]
        }
      }
    ]
  },
  "metadata": {
    "blockCount": 2,
    "processedAt": "2024-01-15T10:30:00.000Z",
    "userId": "user-uuid",
    "version": "${selectedVersion}"
  }
}`;

  const supportedElements = [
    { element: 'Headings', syntax: '# ## ### #### ##### ######', description: 'H1 through H6 headings' },
    { element: 'Paragraphs', syntax: 'Regular text', description: 'Plain text paragraphs' },
    { element: 'Bold Text', syntax: '**text** or __text__', description: 'Bold formatting' },
    { element: 'Italic Text', syntax: '*text* or _text_', description: 'Italic formatting' },
    { element: 'Inline Code', syntax: '`code`', description: 'Inline code snippets' },
    { element: 'Code Blocks', syntax: '```language\ncode\n```', description: 'Multi-line code blocks' },
    { element: 'Lists', syntax: '- item or 1. item', description: 'Bulleted and numbered lists' },
    { element: 'Blockquotes', syntax: '> quote', description: 'Quoted text blocks' },
    { element: 'Links', syntax: '[text](url)', description: 'Hyperlinks' },
    { element: 'Horizontal Rules', syntax: '---', description: 'Divider lines' }
  ];

  const errorCodes = [
    { code: '400', name: 'Bad Request', description: 'Invalid request format or missing required fields' },
    { code: '401', name: 'Unauthorized', description: 'Invalid or missing API key' },
    { code: '413', name: 'Payload Too Large', description: 'Markdown content exceeds size limit (10MB)' },
    { code: '429', name: 'Too Many Requests', description: 'Rate limit exceeded (100 requests per 15 minutes)' },
    { code: '500', name: 'Internal Server Error', description: 'Server processing error' }
  ];

  const rateLimits = [
    { tier: 'Free', requests: '100 per 15 minutes', dailyLimit: '1,000 requests', features: 'Basic conversion' },
    { tier: 'Pro', requests: '1,000 per 15 minutes', dailyLimit: '10,000 requests', features: 'Priority processing' },
    { tier: 'Enterprise', requests: 'Custom', dailyLimit: 'Unlimited', features: 'Custom endpoints' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiBook} className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
              </div>
              
              {/* Version Selector */}
              <div className="relative">
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {API_CONFIG.SUPPORTED_VERSIONS.map(version => (
                    <option key={version} value={version}>
                      Version {version}
                    </option>
                  ))}
                </select>
                <SafeIcon icon={FiChevronDown} className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Quick Start */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Start</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Base URL</h3>
                  <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded text-sm">
                    {baseUrl}
                  </code>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Content Type</h3>
                  <code className="text-green-800 bg-green-100 px-2 py-1 rounded text-sm">
                    application/json
                  </code>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">API Version</h3>
                  <code className="text-purple-800 bg-purple-100 px-2 py-1 rounded text-sm">
                    {selectedVersion}
                  </code>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <SafeIcon icon={FiKey} className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium">API Key Required</span>
                </div>
                <p className="text-yellow-700 mt-2">
                  All API requests must include your API key in the <code className="bg-yellow-100 px-1 rounded">X-API-Key</code> header.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Headers</h3>
                <div className="space-y-2 text-sm">
                  <div><code className="bg-gray-100 px-2 py-1 rounded">X-API-Key: your-api-key-here</code></div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">X-API-Version: {selectedVersion}</code></div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">Content-Type: application/json</code></div>
                </div>
              </div>
            </section>

            {/* Endpoints */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Endpoints</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">POST</span>
                    <code className="text-gray-800">/convert/markdown-to-notion</code>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">Convert Markdown content to Notion API-compatible JSON blocks.</p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Request Body</h4>
                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <pre className="text-sm text-gray-800">
{`{
  "markdown": "string (required) - The markdown content to convert"
}`}
                    </pre>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-2">Response</h4>
                  <div className="bg-gray-50 rounded p-3">
                    <pre className="text-sm text-gray-800">
{`{
  "success": boolean,
  "data": {
    "children": [...] // Array of Notion blocks
  },
  "metadata": {
    "blockCount": number,
    "processedAt": string,
    "userId": string,
    "version": string
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Code Examples */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Code Examples</h2>
              
              <div className="space-y-6">
                {/* JavaScript Example */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">JavaScript</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{codeExample}</code>
                    </pre>
                  </div>
                </div>

                {/* Node.js Example */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Node.js</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{nodeExample}</code>
                    </pre>
                  </div>
                </div>

                {/* Python Example */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Python</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{pythonExample}</code>
                    </pre>
                  </div>
                </div>

                {/* cURL Example */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">cURL</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{curlExample}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Response Example */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Response Example</h2>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{responseExample}</code>
                </pre>
              </div>
            </section>

            {/* Supported Markdown Elements */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Supported Markdown Elements</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Element</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Syntax</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {supportedElements.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.element}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <code className="bg-gray-100 px-2 py-1 rounded">{item.syntax}</code>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Error Codes */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Codes</h2>
              <div className="space-y-4">
                {errorCodes.map((error, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-red-900">{error.code}</span>
                        <span className="text-red-700">{error.name}</span>
                      </div>
                      <p className="text-red-600 text-sm mt-1">{error.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Rate Limits */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rate Limits</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate Limit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Limit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rateLimits.map((limit, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{limit.tier}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{limit.requests}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{limit.dailyLimit}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{limit.features}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Best Practices */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <SafeIcon icon={FiZap} className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Performance</h3>
                  </div>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Batch multiple conversions when possible</li>
                    <li>• Cache results for frequently used content</li>
                    <li>• Use appropriate timeouts for requests</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <SafeIcon icon={FiShield} className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-green-900">Security</h3>
                  </div>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Keep API keys secure and rotate regularly</li>
                    <li>• Use HTTPS for all requests</li>
                    <li>• Validate input before sending to API</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Support */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Support</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  Need help with integration? We're here to support you.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <SafeIcon icon={FiArrowRight} className="h-4 w-4 mr-2" />
                    Contact Support
                  </a>
                  <a href="#" className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    <SafeIcon icon={FiBook} className="h-4 w-4 mr-2" />
                    View Examples
                  </a>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentationPage;