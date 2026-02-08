import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import apiService from '../services/apiService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectCard from '../components/ProjectCard';
import FundingModal from '../components/FundingModal';
import ProjectDetailsModal from '../components/ProjectDetailsModal';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DonorOverview = () => {
  const { t, i18n } = useTranslation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFundingModal, setShowFundingModal] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery('donorStats', apiService.getDashboardStats, {
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });
  const { data: fundingHistory, isLoading: fundingLoading } = useQuery('fundingHistory', apiService.getFundingHistory, {
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  if (statsLoading) return <LoadingSpinner />;

  // Handle both array and paginated response
  const fundings = Array.isArray(fundingHistory) ? fundingHistory : (fundingHistory?.results || []);

  const chartData = {
    labels: (fundings.length > 0 ? fundings.slice(-6) : []).map(f => new Date(f.date).toLocaleDateString()),
    datasets: [{
      label: t('fundingAmount'),
      data: (fundings.length > 0 ? fundings.slice(-6) : []).map(f => f.amount),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.1,
    }],
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl font-bold text-blue-600">$</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('totalFunds')}</p>
              <p className="text-2xl font-bold">${stats?.total_funding?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl font-bold text-green-600">#</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('activeProjects')}</p>
              <p className="text-2xl font-bold">{stats?.active_projects || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl font-bold text-purple-600">✓</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('verifiedReports')}</p>
              <p className="text-2xl font-bold">{stats?.verified_reports || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Chart */}
      {fundings.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{t('fundingHistory')}</h3>
          <div className="h-64">
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      )}

      {/* Recent Funding */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{t('recentFunding')}</h3>
        </div>
        <div className="p-6">
          {fundings.length > 0 ? (
            <div className="space-y-4">
              {fundings.slice(0, 5).reverse().map((funding) => (
                <div key={funding.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{funding.project_title || 'Project'}</p>
                    <p className="text-sm text-gray-600">{new Date(funding.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-green-600">${funding.amount?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">{t('noFundingHistory')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const DonorProjects = () => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { data: projectsData, isLoading, refetch } = useQuery('donorProjects', () => apiService.getProjects({ status: 'approved,active' }), {
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  if (isLoading) return <LoadingSpinner />;

  const projects = projectsData?.results || [];

  const handleFundProject = (project) => {
    setSelectedProject(project);
    setShowFundingModal(true);
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('browseProjects')}</h2>
      
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4 font-bold text-gray-400">[  ]</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noProjectsAvailable')}</h3>
          <p className="text-gray-500">{t('checkBackLater')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onFund={() => handleFundProject(project)}
              onView={() => handleViewDetails(project)}
              showFundButton={true}
            />
          ))}
        </div>
      )}

      {showFundingModal && selectedProject && (
        <FundingModal
          project={selectedProject}
          onClose={() => {
            setShowFundingModal(false);
            setSelectedProject(null);
          }}
          onSuccess={async () => {
            setShowFundingModal(false);
            setSelectedProject(null);
            await refetch(); // Refresh projects after funding
          }}
        />
      )}

      {showDetailsModal && selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};

const DonorFunding = () => {
  const { t } = useTranslation();
  const { data: fundingHistory, isLoading } = useQuery('fundingHistory', apiService.getFundingHistory, {
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  if (isLoading) return <LoadingSpinner />;

  const fundings = Array.isArray(fundingHistory) ? fundingHistory : (fundingHistory?.results || []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('myFunding')}</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('project')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('amount')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fundings.length > 0 ? fundings.map((funding) => (
              <tr key={funding.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {funding.project_title || 'Project'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${funding.amount?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(funding.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {t('completed')}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  {t('noFundingHistory')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DonorReports = () => {
  const { t } = useTranslation();
  const { data: reportsData, isLoading } = useQuery('donorReports', () => apiService.getVerifiedReports(), {
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  if (isLoading) return <LoadingSpinner />;

  const reports = reportsData?.results || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('verifiedReports')}</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('reportTitle')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('project')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('reportType')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length > 0 ? reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.project_title || 'Project'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {t(report.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(report.submission_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {t('verified')}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  {t('noReports')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DonorDashboard = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className={`flex-1 ${i18n.language === 'ar' ? 'mr-64' : 'ml-64'} overflow-auto`}>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<DonorOverview />} />
            <Route path="/projects" element={<DonorProjects />} />
            <Route path="/funding" element={<DonorFunding />} />
            <Route path="/reports" element={<DonorReports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;