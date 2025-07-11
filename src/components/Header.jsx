import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCode, FiUser, FiLogOut, FiBook, FiTerminal, FiMenu, FiX } = FiIcons;

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <SafeIcon icon={FiCode} className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900 hidden sm:inline">
                Markdown to Notion API
              </span>
              <span className="font-bold text-xl text-gray-900 sm:hidden">
                MD2Notion
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none"
              onClick={toggleMenu}
              aria-expanded="false"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/docs"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/docs')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiBook} className="h-4 w-4" />
              <span>Documentation</span>
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiUser} className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/test-console"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/test-console')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiTerminal} className="h-4 w-4" />
                  <span>Test Console</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <SafeIcon icon={FiLogOut} className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg border-t border-gray-200">
            <Link
              to="/docs"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive('/docs')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={closeMenu}
            >
              <SafeIcon icon={FiBook} className="h-5 w-5" />
              <span>Documentation</span>
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={closeMenu}
                >
                  <SafeIcon icon={FiUser} className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/test-console"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/test-console')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={closeMenu}
                >
                  <SafeIcon icon={FiTerminal} className="h-5 w-5" />
                  <span>Test Console</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <SafeIcon icon={FiLogOut} className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;