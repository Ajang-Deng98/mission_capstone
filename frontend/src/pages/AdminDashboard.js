import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import apiService from '../services/apiService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminOverview = () => {
  const { t, i18n } = useTranslation();
  
  const { data: stats, isLoading } = useQuery('adminStats', apiService.getDashboardStats);
  const { data: projectsData } = useQuery('adminProjects', () => apiService.getProjects());
  const { data: usersData } = useQuery('adminUsers', () => apiService.getUsers());

  if (isLoading) return <LoadingSpinner />;

  const projects = projectsData?.results || [];
  const users = usersData?.results || [];

  // Project status chart
  const projectStatusData = {
    labels: [t('active'), t('completed'), t('pending'), t('cancelled')],
    datasets: [{
      data: [
        projects.filter(p => p.status === 'active').length,
        projects.filter(p => p.status === 'completed').length,
        projects.filter(p => p.status === 'pending').length,
        projects.filter(p => p.status === 'cancelled').length,
      ],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
    }]
  };

  // Monthly funding chart
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: t('funding'),
      data: [65000, 59000, 80000, 81000, 56000, 95000],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
    }]
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl font-bold text-blue-600">#</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('totalProjects')}</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl font-bold text-green-600">$</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('totalFunding')}</p>
              <p className="text-2xl font-bold">${stats?.total_funding?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl font-bold text-purple-600">U</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('totalUsers')}</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl font-bold text-yellow-600">O</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('organizations')}</p>
              <p className="text-2xl font-bold">{stats?.total_organizations || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{t('projectStatus')}</h3>
          <div className="h-64">
            <Doughnut data={projectStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{t('monthlyFunding')}</h3>
          <div className="h-64">
            <Bar data={monthlyData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{t('recentActivity')}</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-gray-600">{project.organisation_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${project.target_amount?.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminProjects = () => {
  const { t } = useTranslation();
  const { data: projectsData, isLoading } = useQuery('adminProjects', () => apiService.getProjects());

  if (isLoading) return <LoadingSpinner />;

  const projects = projectsData?.results || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('projectManagement')}</h2>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          {t('addProject')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('project')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('organization')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('target')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('raised')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    <div className="text-sm text-gray-500">{project.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.organisation_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${project.target_amount?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${project.current_funding?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">{t('edit')}</button>
                  <button className="text-red-600 hover:text-red-900">{t('delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const { t } = useTranslation();
  const { data: usersData, isLoading } = useQuery('adminUsers', () => apiService.getUsers());

  if (isLoading) return <LoadingSpinner />;

  const users = usersData?.results || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('userManagement')}</h2>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          {t('addUser')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('user')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('email')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('role')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('organization')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.organisation || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">{t('edit')}</button>
                  <button className="text-red-600 hover:text-red-900">{t('suspend')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProjectApproval = () => {
  const { t } = useTranslation();
  const { data: projectsData, isLoading, refetch } = useQuery('pendingProjects', () => apiService.getProjects({ status: 'pending' }));

  if (isLoading) return <LoadingSpinner />;

  const pendingProjects = projectsData?.results || [];

  const handleApprove = async (projectId) => {
    try {
      await apiService.approveProject(projectId);
      await refetch();
      alert(t('projectApproved'));
    } catch (error) {
      alert(t('error') + ': ' + (error.message || JSON.stringify(error)));
    }
  };

  const handleReject = async (projectId) => {
    try {
      await apiService.rejectProject(projectId);
      await refetch();
      alert(t('projectRejected'));
    } catch (error) {
      alert(t('error') + ': ' + (error.message || JSON.stringify(error)));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('projectApproval')}</h2>
      
      {pendingProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4 font-bold text-gray-400">[  ]</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noPendingProjects')}</h3>
          <p className="text-gray-500">{t('allProjectsReviewed')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-gray-600">{project.organisation_name}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  {t('pending')}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-500">{t('budget')}</span>
                  <p className="font-medium">${project.target_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">{t('location')}</span>
                  <p className="font-medium">{project.location}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">{t('startDate')}</span>
                  <p className="font-medium">{new Date(project.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">{t('endDate')}</span>
                  <p className="font-medium">{new Date(project.end_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleApprove(project.id)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  {t('approve')}
                </button>
                <button
                  onClick={() => handleReject(project.id)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  {t('reject')}
                </button>
                <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
                  {t('viewDetails')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminOrganizations = () => {
  const { t } = useTranslation();
  const { data: orgsData, isLoading } = useQuery('organizations', () => apiService.getOrganizations());

  if (isLoading) return <LoadingSpinner />;

  const organizations = orgsData?.results || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('organizationManagement')}</h2>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          {t('addOrganization')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('organization')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('projects')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('totalFunding')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {organizations.map((org) => (
              <tr key={org.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {org.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {org.project_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${org.total_funding?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">{t('edit')}</button>
                  <button className="text-red-600 hover:text-red-900">{t('suspend')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminReports = () => {
  const { t } = useTranslation();
  const { data: reportsData, isLoading } = useQuery('allReports', () => apiService.getAllReports());

  if (isLoading) return <LoadingSpinner />;

  const reports = reportsData?.results || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('reportsManagement')}</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('reportTitle')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('project')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('submittedBy')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.project_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.submitted_by}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    report.status === 'verified' ? 'bg-green-100 text-green-800' :
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {t(report.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">{t('review')}</button>
                  <button className="text-green-600 hover:text-green-900">{t('verify')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminBlockchain = () => {
  const { t } = useTranslation();
  const { data: blockchainData, isLoading } = useQuery('blockchainVerifications', () => apiService.getBlockchainVerifications());

  if (isLoading) return <LoadingSpinner />;

  const verifications = blockchainData?.results || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('blockchainVerification')}</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('transactionHash')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('project')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('amount')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {verifications.map((verification) => (
              <tr key={verification.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {verification.transaction_hash?.substring(0, 20)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {verification.project_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${verification.amount?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(verification.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {t('verified')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900">{t('viewOnEtherscan')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AuditLogs = () => {
  const { t } = useTranslation();
  const { data: auditData, isLoading } = useQuery('auditLogs', () => apiService.getAuditLogs());

  if (isLoading) return <LoadingSpinner />;

  const logs = auditData?.results || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('auditLogs')}</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('action')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('user')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('resource')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('timestamp')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('ipAddress')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {log.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.resource}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.ip_address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className={`flex-1 ${i18n.language === 'ar' ? 'mr-64' : 'ml-64'} overflow-auto`}>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/projects" element={<AdminProjects />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/organizations" element={<AdminOrganizations />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/blockchain" element={<AdminBlockchain />} />
            <Route path="/approval" element={<ProjectApproval />} />
            <Route path="/audit" element={<AuditLogs />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;