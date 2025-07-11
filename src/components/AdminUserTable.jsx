import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiActivity, FiToggleLeft, FiToggleRight, FiEye, FiKey } = FiIcons;

const AdminUserTable = ({ users, onToggleUserStatus, onViewUserDetails }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'usage.total_requests') {
      aValue = a.usage.total_requests;
      bValue = b.usage.total_requests;
    } else if (sortField === 'usage.last_request') {
      aValue = new Date(a.usage.last_request);
      bValue = new Date(b.usage.last_request);
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center space-x-1">
                <span>User</span>
                {sortField === 'name' && (
                  <SafeIcon 
                    icon={sortDirection === 'asc' ? FiIcons.FiChevronUp : FiIcons.FiChevronDown} 
                    className="h-4 w-4" 
                  />
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('usage.total_requests')}
            >
              <div className="flex items-center space-x-1">
                <span>API Usage</span>
                {sortField === 'usage.total_requests' && (
                  <SafeIcon 
                    icon={sortDirection === 'asc' ? FiIcons.FiChevronUp : FiIcons.FiChevronDown} 
                    className="h-4 w-4" 
                  />
                )}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('usage.last_request')}
            >
              <div className="flex items-center space-x-1">
                <span>Last Request</span>
                {sortField === 'usage.last_request' && (
                  <SafeIcon 
                    icon={sortDirection === 'asc' ? FiIcons.FiChevronUp : FiIcons.FiChevronDown} 
                    className="h-4 w-4" 
                  />
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiActivity} className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{user.usage.total_requests.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {user.usage.this_month} this month
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>
                  <div>{new Date(user.usage.last_request).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(user.usage.last_request).toLocaleTimeString()}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleUserStatus(user.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      user.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <SafeIcon 
                      icon={user.is_active ? FiToggleRight : FiToggleLeft} 
                      className="h-4 w-4 mr-1" 
                    />
                    {user.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => onViewUserDetails(user)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    title="View Details"
                  >
                    <SafeIcon icon={FiEye} className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;