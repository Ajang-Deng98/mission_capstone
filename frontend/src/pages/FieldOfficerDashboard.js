import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import apiService from '../services/apiService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const FieldOfficerOverview = () => {
  const { t, i18n } = useTranslation();
  
  const { data: stats, isLoading } = useQuery('fieldStats', apiService.getDashboardStats);
  const { data: distributionsData } = useQuery('distributions', () => apiService.getDistributions());

  if (isLoading) return <LoadingSpinner />;

  const distributions = distributionsData?.results || [];
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myDistributions = distributions.filter(d => d.field_officer === user.id);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl font-bold text-blue-600">D</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('totalDistributions')}</p>
              <p className="text-2xl font-bold">{myDistributions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl font-bold text-green-600">✓</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('completed')}</p>
              <p className="text-2xl font-bold">{myDistributions.filter(d => d.status === 'completed').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl font-bold text-yellow-600">P</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('pending')}</p>
              <p className="text-2xl font-bold">{myDistributions.filter(d => d.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl font-bold text-purple-600">R</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('reports')}</p>
              <p className="text-2xl font-bold">{stats?.field_reports || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Distributions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{t('recentDistributions')}</h3>
        </div>
        <div className="p-6">
          {myDistributions.length > 0 ? (
            <div className="space-y-4">
              {myDistributions.slice(0, 5).map((distribution) => (
                <div key={distribution.id} className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">{distribution.aid_type}</p>
                    <p className="text-sm text-gray-600">{distribution.location}</p>
                    <p className="text-xs text-gray-500">{new Date(distribution.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{distribution.quantity} {distribution.unit}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      distribution.status === 'completed' ? 'bg-green-100 text-green-800' :
                      distribution.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {distribution.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 font-bold text-gray-400">[  ]</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noDistributions')}</h3>
              <p className="text-gray-500">{t('startFirstDistribution')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignedProjects = () => {
  const { t } = useTranslation();
  const { data: projectsData, isLoading } = useQuery('assignedProjects', () => apiService.getProjects());

  if (isLoading) return <LoadingSpinner />;

  const projects = projectsData?.results || [];
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const assignedProjects = projects.filter(p => p.field_officer === user.id || p.status === 'active');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('assignedProjects')}</h2>
      
      {assignedProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4 font-bold text-gray-400">[  ]</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noAssignedProjects')}</h3>
          <p className="text-gray-500">{t('contactAdmin')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(project.status)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{project.description?.substring(0, 100)}...</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('location')}</span>
                    <span className="font-medium">{project.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('budget')}</span>
                    <span className="font-medium">${project.target_amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('organization')}</span>
                    <span className="font-medium">{project.organisation_name}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded text-sm hover:bg-primary-700">
                    {t('recordDistribution')}
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm hover:bg-gray-300">
                    {t('submitReport')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DistributionsPage = () => {
  const { t } = useTranslation();
  const { data: distributionsData, isLoading } = useQuery('distributions', () => apiService.getDistributions());

  if (isLoading) return <LoadingSpinner />;

  const distributions = distributionsData?.results || [];
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myDistributions = distributions.filter(d => d.field_officer === user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('distributions')}</h2>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          {t('recordDistribution')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('aidType')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('quantity')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('location')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {myDistributions.map((distribution) => (
              <tr key={distribution.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {distribution.aid_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {distribution.quantity} {distribution.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {distribution.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(distribution.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    distribution.status === 'completed' ? 'bg-green-100 text-green-800' :
                    distribution.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {distribution.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">{t('edit')}</button>
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

const FieldReports = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'distribution'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.submitReport(formData);
      alert(t('reportSubmitted'));
      setFormData({ title: '', description: '', location: '', type: 'distribution' });
    } catch (error) {
      alert(t('error') + ': ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('fieldReports')}</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{t('submitReport')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('reportTitle')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('location')}
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">{t('selectLocation')}</option>
                <option value="Juba, Central Equatoria">Juba, Central Equatoria</option>
                <option value="Wau, Western Bahr el Ghazal">Wau, Western Bahr el Ghazal</option>
                <option value="Malakal, Upper Nile">Malakal, Upper Nile</option>
                <option value="Bentiu, Unity State">Bentiu, Unity State</option>
                <option value="Bor, Jonglei State">Bor, Jonglei State</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reportType')}
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="distribution">{t('distribution')}</option>
              <option value="assessment">{t('assessment')}</option>
              <option value="monitoring">{t('monitoring')}</option>
              <option value="incident">{t('incident')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              {t('submitReport')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FieldOfficerDashboard = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className={`flex-1 ${i18n.language === 'ar' ? 'mr-64' : 'ml-64'} overflow-auto`}>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<FieldOfficerOverview />} />
            <Route path="/projects" element={<AssignedProjects />} />
            <Route path="/distributions" element={<DistributionsPage />} />
            <Route path="/reports" element={<FieldReports />} />
            <Route path="/verification" element={<div>Verification & Documentation</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default FieldOfficerDashboard;