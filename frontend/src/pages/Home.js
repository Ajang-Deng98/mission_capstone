import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import apiService from '../services/apiService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({
    total_projects: 0,
    total_funding: 0,
    active_projects: 0,
    completed_projects: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, projectsData] = await Promise.all([
          apiService.getPublicStats(),
          apiService.getPublicProjects()
        ]);
        
        setStats(statsData);
        setRecentProjects(projectsData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: [t('activeProjects'), t('completed'), t('totalFunding') + ' (USD)'],
    datasets: [
      {
        label: t('statistics'),
        data: [stats.active_projects, stats.completed_projects, stats.total_funding / 1000],
        backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b'],
        borderColor: ['#2563eb', '#16a34a', '#d97706'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('projectStatistics'),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section / القسم الرئيسي */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('getStarted')}
              </Link>
              <Link
                to="/how-it-works"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                {t('learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section / قسم الإحصائيات */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {i18n.language === 'ar' ? 'إحصائيات المنصة' : 'Platform Statistics'}
            </h2>
            <p className="text-lg text-gray-600">
              {i18n.language === 'ar' 
                ? 'تتبع تأثير المساعدات الإنسانية في جنوب السودان'
                : 'Track the impact of humanitarian aid in South Sudan'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {stats.total_projects}
              </div>
              <div className="text-gray-600">
                {i18n.language === 'ar' ? 'إجمالي المشاريع' : 'Total Projects'}
              </div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-secondary-600 mb-2">
                ${(stats.total_funding / 1000).toFixed(0)}K
              </div>
              <div className="text-gray-600">
                {i18n.language === 'ar' ? 'إجمالي التمويل' : 'Total Funding'}
              </div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {stats.active_projects}
              </div>
              <div className="text-gray-600">
                {i18n.language === 'ar' ? 'المشاريع النشطة' : 'Active Projects'}
              </div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.completed_projects}
              </div>
              <div className="text-gray-600">
                {i18n.language === 'ar' ? 'المشاريع المكتملة' : 'Completed Projects'}
              </div>
            </div>
          </div>

          {/* Chart / الرسم البياني */}
          <div className="max-w-2xl mx-auto">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </section>

      {/* Recent Projects / المشاريع الحديثة */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {i18n.language === 'ar' ? 'المشاريع الحديثة' : 'Recent Projects'}
            </h2>
            <p className="text-lg text-gray-600">
              {i18n.language === 'ar' 
                ? 'اكتشف أحدث مشاريع المساعدات الإنسانية'
                : 'Discover the latest humanitarian aid projects'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {recentProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      {project.location}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t(project.status)}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{t('fundingProgress')}</span>
                      <span>{project.funding_progress?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(project.funding_progress || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${project.total_funded?.toLocaleString() || 0} / ${project.budget?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/projects"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {t('viewAllProjects')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section / قسم الميزات */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {i18n.language === 'ar' ? 'لماذا AidTrace؟' : 'Why AidTrace?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {i18n.language === 'ar' ? 'شفافية كاملة' : 'Full Transparency'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ar' 
                  ? 'تتبع كل دولار من التبرعات باستخدام تقنية البلوك تشين'
                  : 'Track every dollar of donations using blockchain technology'
                }
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {i18n.language === 'ar' ? 'يعمل بدون إنترنت' : 'Offline Capable'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ar' 
                  ? 'استمر في العمل حتى بدون اتصال بالإنترنت'
                  : 'Continue working even without internet connection'
                }
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {i18n.language === 'ar' ? 'تعاون فعال' : 'Effective Collaboration'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ar' 
                  ? 'ربط المتبرعين والمنظمات والموظفين الميدانيين'
                  : 'Connect donors, organizations, and field officers'
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;