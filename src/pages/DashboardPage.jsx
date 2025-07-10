import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiKey, FiRefreshCw, FiCopy, FiCheck, FiServer } = FiIcons;

const DashboardPage = () => {
  const { user, regenerateApiKey, isDemo, backendType } = useAuth();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleRegenerateApiKey = async () => {
    setRegenerating(true);
    try {
      await regenerateApiKey();
    } catch (error) {
      console.error('Failed to regenerate API key:', error);
    } finally {
      setRegenerating(false);
    }
  };

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
              <SafeIcon icon={FiUser} className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            {isDemo && (
              <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <SafeIcon icon={FiServer} className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Demo Mode Active:</strong> You're using the application in demo mode.
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      All functionality is simulated and no actual API calls are being made.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key {isDemo && <span className="text-yellow-600 text-xs">(Demo)</span>}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={user?.apiKey || ''}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(user?.apiKey || '')}
                        className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <SafeIcon icon={copied ? FiCheck : FiCopy} className="h-4 w-4" />
                      </button>
                    </div>
                    {copied && (
                      <p className="text-sm text-green-600 mt-1">API key copied to clipboard!</p>
                    )}
                  </div>

                  <button
                    onClick={handleRegenerateApiKey}
                    disabled={regenerating}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                  >
                    <SafeIcon
                      icon={FiRefreshCw}
                      className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`}
                    />
                    <span>{regenerating ? 'Regenerating...' : 'Regenerate API Key'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;