import React from 'react';
import { useTranslation } from 'react-i18next';

// Loading Spinner Component / مكون دوار التحميل
const LoadingSpinner = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">{t('loading') || 'Loading...'}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;