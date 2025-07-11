import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiAlertCircle } = FiIcons;

const AdminPlanManager = ({ currentPlan, onUpdatePlan, loading }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const plans = ['Free', 'Lite', 'Pro', 'Enterprise'];

  const handleUpdatePlan = async () => {
    try {
      await onUpdatePlan(selectedPlan);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Update User Plan</h3>
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
          <SafeIcon icon={FiCheck} className="h-5 w-5 mr-2" />
          Plan updated successfully
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <SafeIcon icon={FiAlertCircle} className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Plan
          </label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {plans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleUpdatePlan}
          disabled={loading || selectedPlan === currentPlan}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Plan'}
        </button>
      </div>
    </div>
  );
};

export default AdminPlanManager;