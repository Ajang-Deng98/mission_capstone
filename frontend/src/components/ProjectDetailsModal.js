import React from 'react';
import { useTranslation } from 'react-i18next';

const ProjectDetailsModal = ({ project, onClose }) => {
  const { t, i18n } = useTranslation();

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{t('projectDetails')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title & Status */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {t(project.status)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">{t('description')}</h4>
            <p className="text-gray-600">{project.description}</p>
          </div>

          {/* Organization */}
          {project.organisation_name && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{t('organisation')}</h4>
              <p className="text-gray-600">{project.organisation_name}</p>
            </div>
          )}

          {/* Location */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">{t('location')}</h4>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {project.location}
            </div>
          </div>

          {/* Funding Progress */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">{t('fundingProgress')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t('raised')}: ${project.total_funded?.toLocaleString() || 0}</span>
                <span>{t('goal')}: ${project.budget?.toLocaleString() || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all" 
                  style={{ width: `${Math.min(project.funding_progress || 0, 100)}%` }}
                ></div>
              </div>
              <p className="text-center text-sm font-medium text-primary-600">
                {project.funding_progress?.toFixed(1) || 0}% {t('funded')}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{t('startDate')}</h4>
              <p className="text-gray-600">{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{t('endDate')}</h4>
              <p className="text-gray-600">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          {/* Blockchain Hash */}
          {project.blockchain_hash && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{t('blockchainVerification')}</h4>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-xs font-mono text-gray-600 break-all">{project.blockchain_hash}</p>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${project.blockchain_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 text-sm hover:underline mt-2 inline-block"
                >
                  {t('viewOnEtherscan')} →
                </a>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">{t('createdAt')}</h4>
            <p className="text-gray-600">{project.created_at ? new Date(project.created_at).toLocaleString() : 'N/A'}</p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
