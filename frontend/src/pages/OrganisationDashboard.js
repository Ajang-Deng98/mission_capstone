import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import apiService from '../services/apiService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectCard from '../components/ProjectCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrganisationOverview = () => {
  const { t, i18n } = useTranslation();
  
  const { data: stats, isLoading } = useQuery('orgStats', apiService.getDashboardStats, {
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });
  const { data: projectsData } = useQuery('orgProjects', () => apiService.getProjects(), {
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  if (isLoading) return <LoadingSpinner />;

  const projects = projectsData?.results || [];
  // Show ALL projects for the organisation (no filtering by status)
  const myProjects = projects;

  const projectFundingData = {
    labels: myProjects.slice(0, 5).map(p => p.title.substring(0, 20) + '...'),
    datasets: [{
      label: t('funding'),
      data: myProjects.slice(0, 5).map(p => p.current_funding || 0),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
    }]
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl font-bold text-blue-600">#</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('myProjects')}</p>
              <p className="text-2xl font-bold">{myProjects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl font-bold text-green-600">$</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('totalReceived')}</p>
              <p className="text-2xl font-bold">${myProjects.reduce((sum, p) => sum + (p.current_funding || 0), 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl font-bold text-yellow-600">%</span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm text-gray-600">{t('targetAmount')}</p>
              <p className="text-2xl font-bold">${myProjects.reduce((sum, p) => sum + (p.target_amount || 0), 0).toLocaleString()}</p>
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
              <p className="text-2xl font-bold">{stats?.total_reports || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Funding Chart */}
      {myProjects.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{t('projectFunding')}</h3>
          <div className="h-64">
            <Bar data={projectFundingData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{t('recentProjects')}</h3>
        </div>
        <div className="p-6">
          {myProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} showFundButton={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 font-bold text-gray-400">[  ]</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noProjects')}</h3>
              <p className="text-gray-500 mb-4">{t('createFirstProject')}</p>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                {t('createProject')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrganisationProjects = () => {
  const { t } = useTranslation();
  const { data: projectsData, isLoading } = useQuery('orgProjects', () => apiService.getProjects(), {
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  if (isLoading) return <LoadingSpinner />;

  const projects = projectsData?.results || [];
  // Show ALL projects for the organisation (no filtering by status)
  const myProjects = projects;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('myProjects')}</h2>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          {t('createProject')}
        </button>
      </div>

      {myProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4 font-bold text-gray-400">[  ]</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noProjects')}</h3>
          <p className="text-gray-500 mb-4">{t('createFirstProject')}</p>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            {t('createProject')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'pending' ? '⏳ Pending Approval' :
                     project.status === 'approved' ? '✅ Approved' :
                     project.status === 'active' ? '🟢 Active' :
                     project.status === 'rejected' ? '❌ Rejected' :
                     project.status === 'completed' ? '✔️ Completed' :
                     project.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{project.description?.substring(0, 100)}...</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('target')}</span>
                    <span className="font-medium">${project.target_amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('raised')}</span>
                    <span className="font-medium text-green-600">${project.current_funding?.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((project.current_funding || 0) / (project.target_amount || 1) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded text-sm hover:bg-primary-700">
                    {t('edit')}
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm hover:bg-gray-300">
                    {t('reports')}
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

const CreateProject = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    start_date: '',
    end_date: '',
    sector: '',
    beneficiaries: ''
  });

  const { refetch: refetchProjects } = useQuery('orgProjects', () => apiService.getProjects());
  const { refetch: refetchStats } = useQuery('orgStats', apiService.getDashboardStats);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await apiService.createProject(formData);
      alert(t('projectCreatedPendingApproval'));
      setFormData({
        title: '',
        description: '',
        budget: '',
        location: '',
        start_date: '',
        end_date: '',
        sector: '',
        beneficiaries: ''
      });
      // Refresh data
      await refetchProjects();
      await refetchStats();
    } catch (error) {
      console.error('Project creation error:', error);
      alert(t('error') + ': ' + JSON.stringify(error));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('createProject')}</h2>
        <p className="mt-1 text-sm text-gray-600">Fill in the details below to submit a new project for approval</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Clean Water Access - Juba"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector *
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({...formData, sector: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select sector</option>
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="Food Security">Food Security</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Shelter">Shelter</option>
                  <option value="Protection">Protection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your project objectives, activities, and expected outcomes..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., Juba, Central Equatoria"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Beneficiaries *
                  </label>
                  <input
                    type="number"
                    value={formData.beneficiaries}
                    onChange={(e) => setFormData({...formData, beneficiaries: e.target.value})}
                    placeholder="Number of people"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (USD) *
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="50000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (months) *
                  </label>
                  <input
                    type="number"
                    placeholder="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Project Approval Workflow</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-2">After submission, your project will go through the following stages:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li><strong>Pending:</strong> Your project is under review by administrators</li>
                    <li><strong>Approved/Active:</strong> Project is visible to donors and can receive funding</li>
                    <li><strong>Funded:</strong> When donors contribute, you'll see funding updates immediately in your dashboard</li>
                    <li><strong>Distribution:</strong> Your field officers can record aid distributions</li>
                  </ol>
                  <p className="mt-2 font-medium">Note: Only approved projects are visible to donors for funding.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({ title: '', description: '', budget: '', location: '', start_date: '', end_date: '', sector: '', beneficiaries: '' })}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrganisationReports = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    type: 'progress'
  });

  const { data: projectsData } = useQuery('orgProjects', () => apiService.getProjects());
  const projects = projectsData?.results || [];
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myProjects = projects.filter(p => p.organisation_name === user.organisation);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.submitReport(formData);
      alert(t('reportSubmitted'));
      setFormData({ title: '', description: '', project_id: '', type: 'progress' });
    } catch (error) {
      alert(t('error') + ': ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('submitReport')}</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {t('project')}
              </label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">{t('selectProject')}</option>
                {myProjects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
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
              <option value="progress">{t('progressReport')}</option>
              <option value="financial">{t('financialReport')}</option>
              <option value="impact">{t('impactReport')}</option>
              <option value="completion">{t('completionReport')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={6}
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

const OrganisationFieldOfficers = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: ''
  });

  const { data: usersData, refetch } = useQuery('fieldOfficers', () => apiService.getUsers());
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Current user:', user);
  console.log('All users data:', usersData);
  const fieldOfficers = (usersData?.results || usersData || []).filter(u => u.is_approved);
  console.log('Approved field officers:', fieldOfficers);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createFieldOfficer({ ...formData, role: 'field_officer' });
      alert('Field Officer created successfully');
      setFormData({ username: '', email: '', password: '', first_name: '', last_name: '', phone: '' });
      setShowForm(false);
      refetch();
    } catch (error) {
      alert(t('error') + ': ' + JSON.stringify(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Field Officers</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          {showForm ? 'Cancel' : 'Add Field Officer'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Field Officer</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
              >
                Create Field Officer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fieldOfficers.length > 0 ? fieldOfficers.map((officer) => (
              <tr key={officer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {officer.first_name} {officer.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    officer.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {officer.is_approved ? 'Active' : 'Pending'}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No field officers yet. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrganisationDistributions = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    project_id: '',
    beneficiaries_count: '',
    aid_type: '',
    quantity: '',
    location: '',
    notes: ''
  });

  const { data: projectsData } = useQuery('orgProjects', () => apiService.getProjects());
  const { data: distributionsData } = useQuery('distributions', () => apiService.getDistributions());
  
  const projects = projectsData?.results || [];
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myProjects = projects.filter(p => p.organisation_name === user.organisation);
  const distributions = distributionsData?.results || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.recordDistribution(formData);
      alert(t('distributionRecorded'));
      setFormData({ project_id: '', beneficiaries_count: '', aid_type: '', quantity: '', location: '', notes: '' });
    } catch (error) {
      alert(t('error') + ': ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('recordDistribution')}</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('project')}
              </label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">{t('selectProject')}</option>
                {myProjects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('aidType')}
              </label>
              <select
                value={formData.aid_type}
                onChange={(e) => setFormData({...formData, aid_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select Aid Type</option>
                <option value="Food">Food</option>
                <option value="Water">Water</option>
                <option value="Medicine">Medicine</option>
                <option value="Shelter">Shelter</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiaries Count
              </label>
              <input
                type="number"
                value={formData.beneficiaries_count}
                onChange={(e) => setFormData({...formData, beneficiaries_count: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('quantity')}
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
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
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              {t('recordDistribution')}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Distributions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{t('recentDistributions')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('project')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('aidType')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Beneficiaries</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('location')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {distributions.length > 0 ? distributions.slice(0, 10).map((dist) => (
                <tr key={dist.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{dist.project_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{dist.aid_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{dist.beneficiaries_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{dist.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(dist.distribution_date).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {t('noDistributions')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OrganisationDashboard = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className={`flex-1 ${i18n.language === 'ar' ? 'mr-64' : 'ml-64'} overflow-auto`}>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<OrganisationOverview />} />
            <Route path="/projects" element={<OrganisationProjects />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/field-officers" element={<OrganisationFieldOfficers />} />
            <Route path="/reports" element={<OrganisationReports />} />
            <Route path="/distributions" element={<OrganisationDistributions />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default OrganisationDashboard;