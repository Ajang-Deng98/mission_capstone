import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../services/apiService';

const FundingModal = ({ project, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiService.fundProject({
        project: project.id,
        amount: parseFloat(amount)
      });
      
      alert(t('fundingSuccess') || 'Funding successful!');
      onSuccess();
    } catch (err) {
      console.error('Funding error:', err);
      const errorMessage = err?.error || err?.message || JSON.stringify(err) || t('fundingError') || 'Funding failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t('fundProject')}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-900">{project.title}</h4>
            <p className="text-sm text-gray-600">{project.location}</p>
            <div className="mt-2 text-sm">
              <span className="text-gray-600">{t('needed')}: </span>
              <span className="font-medium">${(project.budget - project.total_funded).toLocaleString()}</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fundingAmount')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading || !amount}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? t('processing') || 'Processing...' : t('fundNow') || 'Fund Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FundingModal;