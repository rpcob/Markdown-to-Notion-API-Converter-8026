import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiCode, FiCopy, FiCheck } = FiIcons;

const DocumentationPage = () => {
  const { user } = useAuth();
  const [copiedSection, setCopiedSection] = useState('');

  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const exampleMarkdown = `# Escalation and Report Updates

**Attendees**: Rabia, Corey, Ryan Cobden

## Agenda

- Status update on escalations
- Progress on report developments
- Technical issues and support needs

## Discussion Points

- **Escalation 1**: A simple issue related to deployment being misrouted to fraud instead of UAT.
- **Escalation 2**: Initially flagged as a data type issue, it appeared resolved upon later review.

## Action Items

- _Corey_: Assist with the linked server issue once current tasks are complete.
- _Rabia_: Test Escalation 2 to confirm the fix and ensure no further action is needed.`;

  const curlExample = `curl -X POST https://api.example.com/convert/markdown-to-notion \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${user?.apiKey || 'YOUR_API_KEY'}" \\
  -d '{
    "markdown": "# Hello World\\n\\nThis is a **bold** text."
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
                "content": "bold"
              },
              "annotations": {
                "bold": true
              }
            },
            {
              "type": "text",
              "text": {
                "content": " text."
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
    "userId": "user-123"
  }
}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiBook} className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
            </div>

            <div className="space-y-8">
              {/* Overview */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-600 mb-4">
                  The Markdown to Notion API allows you to convert Markdown content into Notion API-compatible JSON format. 
                  This enables seamless integration of Markdown content into your Notion workflows.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Base URL</h3>
                  <code className="text-blue-800">https://api.example.com</code>
                </div>
              </section>

              {/* Authentication */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h2>
                <p className="text-gray-600 mb-4">
                  All API requests require authentication using your API key. Include your API key in the request headers:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Header</h3>
                    <button
                      onClick={() => copyToClipboard('X-API-Key: YOUR_API_KEY', 'auth')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={copiedSection === 'auth' ? FiCheck : FiCopy} className="h-4 w-4" />
                    </button>
                  </div>
                  <code className="text-gray-800">X-API-Key: YOUR_API_KEY</code>
                </div>
              </section>

              {/* Supported Markdown */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Supported Markdown Elements</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Structure</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• # Headings (H1-H6)</li>
                      <li>• Paragraphs</li>
                      <li>• - Bulleted lists</li>
                      <li>• 1. Numbered lists</li>
                      <li>• {'>'} Blockquotes</li>
                      <li>• ```Code blocks```</li>
                      <li>• --- Horizontal rules</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Formatting</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• **Bold text**</li>
                      <li>• *Italic text*</li>
                      <li>• `Inline code`</li>
                      <li>• [Links](url)</li>
                      <li>• Line breaks</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* API Endpoint */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Convert Markdown to Notion</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">POST</span>
                    <code className="text-gray-800">/convert/markdown-to-notion</code>
                  </div>
                </div>

                <h3 className="font-medium text-gray-900 mb-3">Request Body</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <pre className="text-sm text-gray-800">
{`{
  "markdown": "string (required, max 50,000 characters)"
}`}
                  </pre>
                </div>

                <h3 className="font-medium text-gray-900 mb-3">Example Request</h3>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">cURL</span>
                    <button
                      onClick={() => copyToClipboard(curlExample, 'curl')}
                      className="text-gray-400 hover:text-white"
                    >
                      <SafeIcon icon={copiedSection === 'curl' ? FiCheck : FiCopy} className="h-4 w-4" />
                    </button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{curlExample}</code>
                  </pre>
                </div>

                <h3 className="font-medium text-gray-900 mb-3">Example Response</h3>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">JSON</span>
                    <button
                      onClick={() => copyToClipboard(responseExample, 'response')}
                      className="text-gray-400 hover:text-white"
                    >
                      <SafeIcon icon={copiedSection === 'response' ? FiCheck : FiCopy} className="h-4 w-4" />
                    </button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{responseExample}</code>
                  </pre>
                </div>
              </section>

              {/* Error Handling */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Handling</h2>
                <div className="space-y-4">
                  <div className="border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-900 mb-2">400 Bad Request</h3>
                    <p className="text-red-700 text-sm">Invalid or missing markdown content</p>
                  </div>
                  <div className="border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-900 mb-2">401 Unauthorized</h3>
                    <p className="text-red-700 text-sm">Invalid or missing API key</p>
                  </div>
                  <div className="border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-900 mb-2">429 Too Many Requests</h3>
                    <p className="text-red-700 text-sm">Rate limit exceeded</p>
                  </div>
                </div>
              </section>

              {/* Rate Limits */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Rate Limits</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• 100 requests per 15 minutes per IP address</li>
                    <li>• Maximum 50,000 characters per request</li>
                    <li>• Content is processed in chunks for optimal performance</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentationPage;