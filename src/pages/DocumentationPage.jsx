import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import ContactSupportModal from '../components/ContactSupportModal';
import { API_CONFIG, getApiUrl } from '../config/api';
import * as FiIcons from 'react-icons/fi';

const {
  FiBook,
  FiCode,
  FiKey,
  FiZap,
  FiShield,
  FiCheck,
  FiInfo,
  FiChevronDown,
  FiArrowRight,
  FiAlertCircle,
  FiClock,
  FiActivity,
  FiRefreshCw,
  FiMail,
} = FiIcons;

// Define rate limits
const rateLimits = [
  {
    tier: 'Free',
    requests: '10 per 15 minutes',
    dailyLimit: '100 requests',
    features: 'Basic conversion'
  },
  {
    tier: 'Lite',
    requests: '500 per 15 minutes',
    dailyLimit: '5,000 requests',
    features: 'Quick processing'
  },
  {
    tier: 'Pro',
    requests: '2,000 per 15 minutes',
    dailyLimit: '25,000 requests',
    features: 'Priority processing'
  },
  {
    tier: 'Enterprise',
    requests: 'Unlimited',
    dailyLimit: 'Unlimited',
    features: 'Custom endpoints'
  }
];

const DocumentationPage = () => {
  const [selectedVersion, setSelectedVersion] = useState(API_CONFIG.CURRENT_VERSION);
  const [expandedSection, setExpandedSection] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const baseUrl = API_CONFIG.FRONTEND_URL;
  const supabaseUrl = API_CONFIG.BASE_URL;
  const supabaseRpcUrl = `${API_CONFIG.BASE_URL}/rest/v1/rpc`;

  // Toggle section expansion (for mobile view)
  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  };

  const markdownToNotionExample = `// Example: Convert Markdown to Notion using Supabase
import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabaseUrl = '${API_CONFIG.BASE_URL}'
const supabaseKey = 'your-api-key-here'
const supabase = createClient(supabaseUrl, supabaseKey)

// Convert markdown to Notion format
async function convertMarkdown(markdown) {
  try {
    // Call the RPC function
    const { data, error } = await supabase
      .rpc('convert_markdown_to_notion', { markdown_content: markdown })
      
    if (error) throw error
    return data
  } catch (error) {
    console.error('Conversion failed:', error)
    throw error
  }
}

// Example usage
convertMarkdown(\`# My Document\nThis is a **sample** markdown document\`)
  .then(notionBlocks => console.log(notionBlocks))
  .catch(error => console.error(error))`;

  const notionToMarkdownExample = `// Example: Convert Notion JSON to Markdown using Supabase
import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabaseUrl = '${API_CONFIG.BASE_URL}'
const supabaseKey = 'your-api-key-here'
const supabase = createClient(supabaseUrl, supabaseKey)

// Convert Notion JSON to Markdown
async function convertNotionToMarkdown(notionJson) {
  try {
    // Call the RPC function
    const { data, error } = await supabase
      .rpc('convert_notion_to_markdown', { notion_json: notionJson })
      
    if (error) throw error
    return data
  } catch (error) {
    console.error('Conversion failed:', error)
    throw error
  }
}

// Example usage with Notion JSON object
const notionJson = {
  children: [
    {
      object: "block",
      type: "heading_1",
      heading_1: {
        rich_text: [{ type: "text", text: { content: "My Document" } }]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          { type: "text", text: { content: "This is a " } },
          { type: "text", text: { content: "sample" }, annotations: { bold: true } },
          { type: "text", text: { content: " document" } }
        ]
      }
    }
  ]
}

convertNotionToMarkdown(notionJson)
  .then(markdown => console.log(markdown))
  .catch(error => console.error(error))`;

  const nodeExample = `// Node.js Example 
const { createClient } = require('@supabase/supabase-js')

async function convertMarkdown(markdown, apiKey) {
  try {
    // Initialize Supabase client
    const supabase = createClient('${API_CONFIG.BASE_URL}', apiKey)
    
    // Call the RPC function
    const { data, error } = await supabase
      .rpc('convert_markdown_to_notion', { markdown_content: markdown })
      
    if (error) throw error
    return data
  } catch (error) {
    console.error('Conversion failed:', error)
    throw error
  }
}

// For Notion to Markdown conversion
async function convertNotionToMarkdown(notionJson, apiKey) {
  try {
    // Initialize Supabase client
    const supabase = createClient('${API_CONFIG.BASE_URL}', apiKey)
    
    // Call the RPC function
    const { data, error } = await supabase
      .rpc('convert_notion_to_markdown', { notion_json: notionJson })
      
    if (error) throw error
    return data
  } catch (error) {
    console.error('Conversion failed:', error)
    throw error
  }
}`;

  const pythonExample = `# Python Example
import supabase

# Initialize client
client = supabase.create_client('${API_CONFIG.BASE_URL}', 'your-api-key-here')

def convert_markdown(markdown):
    try:
        # Call the RPC function
        response = client.rpc('convert_markdown_to_notion', {'markdown_content': markdown}).execute()
        if response.error:
            raise Exception(response.error.message)
        return response.data
    except Exception as e:
        print(f"Error: {e}")
        raise

def convert_notion_to_markdown(notion_json):
    try:
        # Call the RPC function
        response = client.rpc('convert_notion_to_markdown', {'notion_json': notion_json}).execute()
        if response.error:
            raise Exception(response.error.message)
        return response.data
    except Exception as e:
        print(f"Error: {e}")
        raise`;

  const curlMarkdownToNotionExample = `# cURL Example - Using Supabase REST API
curl -X POST '${supabaseRpcUrl}/convert_markdown_to_notion' \\
  -H 'apikey: your-api-key-here' \\
  -H 'Content-Type: application/json' \\
  -d '{"markdown_content": "# Hello World\\n\\n- [ ] Task item\\n- [x] Completed task\\n\\nThis is a **sample** markdown."}'`;

  const curlNotionToMarkdownExample = `# cURL Example - Using Supabase REST API
curl -X POST '${supabaseRpcUrl}/convert_notion_to_markdown' \\
  -H 'apikey: your-api-key-here' \\
  -H 'Content-Type: application/json' \\
  -d '{"notion_json": {"children":[{"object":"block","type":"heading_1","heading_1":{"rich_text":[{"type":"text","text":{"content":"Hello World"}}]}},{"object":"block","type":"to_do","to_do":{"rich_text":[{"type":"text","text":{"content":"Task item"}}],"checked":false}},{"object":"block","type":"to_do","to_do":{"rich_text":[{"type":"text","text":{"content":"Completed task"}}],"checked":true}},{"object":"block","type":"paragraph","paragraph":{"rich_text":[{"type":"text","text":{"content":"This is a "}},{"type":"text","text":{"content":"sample"},"annotations":{"bold":true}},{"type":"text","text":{"content":" markdown."}}]}}]}}'`;

  const markdownRequestBodyExample = `{"markdown_content": "# Hello World\\n\\n- [ ] Task item\\n- [x] Completed task\\n\\nThis is a **sample** markdown."}`;
  
  const notionRequestBodyExample = `{
  "notion_json": {
    "children": [
      {
        "object": "block",
        "type": "heading_1",
        "heading_1": {
          "rich_text": [{ "type": "text", "text": { "content": "Hello World" } }]
        }
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            { "type": "text", "text": { "content": "This is a " } },
            { "type": "text", "text": { "content": "sample" }, "annotations": { "bold": true } },
            { "type": "text", "text": { "content": " markdown." } }
          ]
        }
      }
    ]
  }
}`;

  const markdownToNotionResponseExample = `{
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
              "text": {"content": "Hello World"}
            }
          ]
        }
      },
      {
        "object": "block",
        "type": "to_do",
        "to_do": {
          "rich_text": [
            {
              "type": "text",
              "text": {"content": "Task item"}
            }
          ],
          "checked": false
        }
      },
      {
        "object": "block",
        "type": "to_do",
        "to_do": {
          "rich_text": [
            {
              "type": "text",
              "text": {"content": "Completed task"}
            }
          ],
          "checked": true
        }
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {"content": "This is a "}
            },
            {
              "type": "text",
              "text": {"content": "sample"},
              "annotations": {"bold": true}
            },
            {
              "type": "text",
              "text": {"content": " markdown."}
            }
          ]
        }
      }
    ]
  },
  "metadata": {
    "blockCount": 4,
    "processedAt": "2024-01-15T10:30:00.000Z",
    "userId": "user-uuid",
    "version": "${selectedVersion}"
  }
}`;

  const notionToMarkdownResponseExample = `{
  "success": true,
  "data": "# Hello World\\n\\n- [ ] Task item\\n- [x] Completed task\\n\\nThis is a **sample** markdown.\\n",
  "metadata": {
    "processedAt": "2024-01-15T10:30:00.000Z",
    "userId": "user-uuid",
    "version": "${selectedVersion}"
  }
}`;

  const supportedElements = [
    {
      element: 'Headings',
      syntax: '# ## ### #### ##### ######',
      description: 'H1 through H6 headings',
    },
    {
      element: 'Paragraphs',
      syntax: 'Regular text',
      description: 'Plain text paragraphs',
    },
    {
      element: 'Bold Text',
      syntax: '**text** or __text__',
      description: 'Bold formatting',
    },
    {
      element: 'Italic Text',
      syntax: '*text* or _text_',
      description: 'Italic formatting',
    },
    {
      element: 'Inline Code',
      syntax: '`code`',
      description: 'Inline code snippets',
    },
    {
      element: 'Code Blocks',
      syntax: '```language\ncode\n```',
      description: 'Multi-line code blocks',
    },
    {
      element: 'Lists',
      syntax: '- item or 1. item',
      description: 'Bulleted and numbered lists',
    },
    {
      element: 'Task Lists',
      syntax: '- [ ] task or - [x] done',
      description: 'Checkboxes and todo items',
    },
    {
      element: 'Blockquotes',
      syntax: '> quote',
      description: 'Quoted text blocks',
    },
    {
      element: 'Links',
      syntax: '[text](url)',
      description: 'Hyperlinks',
    },
    {
      element: 'Horizontal Rules',
      syntax: '---',
      description: 'Divider lines',
    },
  ];

  const errorCodes = [
    {
      code: '400',
      name: 'Bad Request',
      description: 'Invalid request format or missing required fields',
    },
    {
      code: '401',
      name: 'Unauthorized',
      description: 'Invalid or missing API key',
    },
    {
      code: '413',
      name: 'Payload Too Large',
      description: 'Content exceeds size limit (10MB)',
    },
    {
      code: '429',
      name: 'Too Many Requests',
      description: 'Rate limit exceeded (500 requests per 15 minutes)',
    },
    {
      code: '500',
      name: 'Internal Server Error',
      description: 'Server processing error',
    },
  ];

  // Section component for mobile-friendly collapsible sections
  const DocSection = ({ id, title, children }) => {
    const isExpanded = expandedSection === id || window.innerWidth >= 768;
    return (
      <section className="mb-8 sm:mb-12">
        <div
          className="flex items-center justify-between cursor-pointer md:cursor-default mb-4"
          onClick={() => toggleSection(id)}
        >
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <SafeIcon
            icon={FiChevronDown}
            className={`h-5 w-5 text-gray-500 md:hidden transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            isExpanded
              ? 'max-h-full opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden md:max-h-full md:opacity-100'
          }`}
        >
          {children}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiBook} className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">API Documentation</h1>
              </div>
              {/* Version Selector */}
              <div className="relative">
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {API_CONFIG.SUPPORTED_VERSIONS.map((version) => (
                    <option key={version} value={version}>
                      Version {version}
                    </option>
                  ))}
                </select>
                <SafeIcon
                  icon={FiChevronDown}
                  className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Quick Start */}
            <DocSection id="quick-start" title="Quick Start">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Supabase URL</h3>
                  <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded text-sm break-all">
                    {supabaseUrl}
                  </code>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">RPC Endpoint</h3>
                  <code className="text-green-800 bg-green-100 px-2 py-1 rounded text-sm break-all">
                    {supabaseRpcUrl}
                  </code>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">API Version</h3>
                  <code className="text-purple-800 bg-purple-100 px-2 py-1 rounded text-sm">
                    {selectedVersion}
                  </code>
                </div>
              </div>
            </DocSection>

            {/* Authentication */}
            <DocSection id="authentication" title="Authentication">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <SafeIcon icon={FiKey} className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium">API Key Required</span>
                </div>
                <p className="text-yellow-700 mt-2">
                  All API requests must include your API key in the{' '}
                  <code className="bg-yellow-100 px-1 rounded">apikey</code> header when using Supabase.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Headers</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <code className="bg-gray-100 px-2 py-1 rounded">apikey: your-api-key-here</code>
                  </div>
                  <div>
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      Content-Type: application/json
                    </code>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* Endpoints */}
            <DocSection id="endpoints" title="API Endpoints">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      POST
                    </span>
                    <code className="text-gray-800">/convert_markdown_to_notion</code>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">
                    Converts markdown content to Notion API-compatible JSON format.
                  </p>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Endpoint URL:</h4>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm block mb-2 overflow-x-auto break-all">
                      {supabaseRpcUrl}/convert_markdown_to_notion
                    </code>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Request Body:</h4>
                    <div className="bg-gray-900 text-gray-100 rounded-md p-3 overflow-x-auto">
                      <pre className="text-sm">
                        <code>{markdownRequestBodyExample}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      POST
                    </span>
                    <code className="text-gray-800">/convert_notion_to_markdown</code>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">
                    Converts Notion API JSON format to markdown content.
                  </p>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Endpoint URL:</h4>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm block mb-2 overflow-x-auto break-all">
                      {supabaseRpcUrl}/convert_notion_to_markdown
                    </code>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Request Body:</h4>
                    <div className="bg-gray-900 text-gray-100 rounded-md p-3 overflow-x-auto">
                      <pre className="text-sm">
                        <code>{notionRequestBodyExample}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* Integration Methods */}
            <DocSection id="integration" title="Integration Methods">
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        Method 1
                      </span>
                      <code className="text-gray-800">Supabase JavaScript Client</code>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600">
                      Use the Supabase JavaScript client to directly interact with your backend through RPC functions.
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        Method 2
                      </span>
                      <code className="text-gray-800">Supabase REST API</code>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600">
                      Use direct HTTP calls to the Supabase REST API endpoints to integrate with any programming language.
                    </p>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* Code Examples */}
            <DocSection id="code-examples" title="Code Examples">
              <div className="space-y-6">
                {/* JavaScript Example - Markdown to Notion */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">JavaScript - Markdown to Notion</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{markdownToNotionExample}</code>
                    </pre>
                  </div>
                </div>

                {/* JavaScript Example - Notion to Markdown */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">JavaScript - Notion to Markdown</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{notionToMarkdownExample}</code>
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

                {/* cURL Example - Markdown to Notion */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">cURL - Markdown to Notion</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{curlMarkdownToNotionExample}</code>
                    </pre>
                  </div>
                </div>

                {/* cURL Example - Notion to Markdown */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">cURL - Notion to Markdown</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{curlNotionToMarkdownExample}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* Response Example */}
            <DocSection id="response" title="Response Examples">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Markdown to Notion Response</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{markdownToNotionResponseExample}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notion to Markdown Response</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{notionToMarkdownResponseExample}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* Supported Markdown Elements */}
            <DocSection id="supported-elements" title="Supported Markdown Elements">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Element
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Syntax
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {supportedElements.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.element}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <code className="bg-gray-100 px-2 py-1 rounded">{item.syntax}</code>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                          {item.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DocSection>

            {/* Error Codes */}
            <DocSection id="error-codes" title="Error Codes">
              <div className="space-y-4">
                {errorCodes.map((error, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
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
            </DocSection>

            {/* Rate Limits */}
            <DocSection id="rate-limits" title="Rate Limits">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tier
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate Limit
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Daily Limit
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Features
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rateLimits.map((limit, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {limit.tier}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {limit.requests}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {limit.dailyLimit}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                          {limit.features}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DocSection>

            {/* Support */}
            <DocSection id="support" title="Support">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <p className="text-gray-600 mb-4">Need help with integration? We're here to support you.</p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <SafeIcon icon={FiMail} className="h-4 w-4 mr-2" />
                    Contact Support
                  </button>
                  <a
                    href="#code-examples"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <SafeIcon icon={FiBook} className="h-4 w-4 mr-2" />
                    View Examples
                  </a>
                </div>
              </div>
            </DocSection>
          </div>
        </motion.div>
      </div>
      
      {/* Contact Support Modal */}
      <ContactSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default DocumentationPage;