import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import ContactSupportModal from '../components/ContactSupportModal';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiCode, FiZap, FiShield, FiCheckCircle, FiMail } = FiIcons;

const LandingPage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const features = [
    {
      icon: FiCode,
      title: 'Markdown to Notion',
      description: 'Convert any Markdown content to Notion API-compatible JSON format with perfect formatting preservation.',
    },
    {
      icon: FiZap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast conversion with intelligent character limit handling and semantic text splitting.',
    },
    {
      icon: FiShield,
      title: 'Secure API',
      description: 'Protected with API key authentication, rate limiting, and secure user management.',
    },
  ];

  const steps = [
    {
      step: 1,
      title: 'Prepare Markdown Content',
      description: 'Create or retrieve the markdown text you want to convert to Notion format.',
    },
    {
      step: 2,
      title: 'Send Conversion Request',
      description: 'Make a POST request to our API endpoint with your markdown content.',
    },
    {
      step: 3,
      title: 'Receive Notion JSON',
      description: 'Get back perfectly formatted Notion API-compatible JSON blocks.',
    },
    {
      step: 4,
      title: 'Utilize in Notion',
      description: 'Use the JSON response to create or update Notion pages seamlessly.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-10 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              Markdown to Notion
              <span className="block text-blue-200">API Converter</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto">
              Transform your Markdown content into Notion API-compatible JSON with our powerful, secure REST API.
              Perfect for developers and content creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Get Started Free
                <SafeIcon icon={FiArrowRight} className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-200 text-blue-100 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our API?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Built for developers who need reliable, fast, and secure Markdown to Notion conversion.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 sm:p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <SafeIcon icon={feature.icon} className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to convert your Markdown content to Notion format.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Start Converting?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of developers using our API to seamlessly integrate Markdown content into their Notion workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Get Your API Key
                <SafeIcon icon={FiArrowRight} className="ml-2 h-5 w-5" />
              </Link>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-200 text-blue-100 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiMail} className="mr-2 h-5 w-5" />
                Contact Support
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Support Modal */}
      <ContactSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;