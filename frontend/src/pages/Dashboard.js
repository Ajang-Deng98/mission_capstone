import React from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('welcome')} {user.first_name || user.username}
          </h1>
          <p className="text-gray-600">
            {t('role')}: {t(user.role)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;