import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiMail, FiUser, FiMessageSquare, FiSend, FiCheck, FiAlertCircle } = FiIcons;

const ContactSupportModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(formData.subject || 'Support Request');
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n\n` +
        `Message:\n${formData.message}`
      );
      
      const mailtoLink = `mailto:comforttacom@gmail.com?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success message
      setSuccess(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to open email client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Contact Support</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiX} className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email Client Opened!</h3>
              <p className="text-gray-600">
                Your default email client should now be open with the support request pre-filled.
                If it didn't open automatically, please send an email to{' '}
                <a href="mailto:comforttacom@gmail.com" className="text-blue-600 hover:underline">
                  comforttacom@gmail.com
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                  <SafeIcon icon={FiAlertCircle} className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                  <SafeIcon icon={FiUser} className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                  <SafeIcon icon={FiMail} className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your request"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Please describe your issue or question in detail..."
                  />
                  <SafeIcon icon={FiMessageSquare} className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiSend} className="h-4 w-4" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactSupportModal;