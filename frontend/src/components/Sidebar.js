import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const menuItems = {
    admin: [
      { path: '/admin', label: t('dashboard') || 'Dashboard' },
      { path: '/admin/projects', label: t('projects') || 'Projects' },
      { path: '/admin/users', label: t('users') || 'Users' },
      { path: '/admin/organizations', label: t('organizations') || 'Organizations' },
      { path: '/admin/reports', label: t('reports') || 'Reports' },
      { path: '/admin/blockchain', label: t('blockchain') || 'Blockchain' },
    ],
    donor: [
      { path: '/donor', label: t('dashboard') || 'Dashboard' },
      { path: '/donor/projects', label: t('browseProjects') || 'Browse Projects' },
      { path: '/donor/funding', label: t('fundingHistory') || 'Funding History' },
      { path: '/donor/reports', label: t('verifiedReports') || 'Verified Reports' },
    ],
    organisation: [
      { path: '/organisation', label: t('dashboard') || 'Dashboard' },
      { path: '/organisation/projects', label: t('myProjects') || 'My Projects' },
      { path: '/organisation/create-project', label: t('createProject') || 'Create Project' },
      { path: '/organisation/field-officers', label: t('fieldOfficers') || 'Field Officers' },
      { path: '/organisation/reports', label: t('reports') || 'Reports' },
      { path: '/organisation/distributions', label: t('distributions') || 'Distributions' },
    ],
    field_officer: [
      { path: '/field-officer', label: t('dashboard') || 'Dashboard' },
      { path: '/field-officer/distributions', label: t('distributions') || 'Distributions' },
      { path: '/field-officer/reports', label: t('fieldReports') || 'Field Reports' },
      { path: '/field-officer/verification', label: t('verification') || 'Verification' },
    ]
  };

  const currentMenuItems = menuItems[user.role] || menuItems.donor;

  return (
    <div className={`fixed inset-y-0 ${i18n.language === 'ar' ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
          <h1 className="text-xl font-bold text-white">AidTrace SS</h1>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={`${i18n.language === 'ar' ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {currentMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="px-4 py-4 border-t border-gray-200 space-y-2">
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
          >
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
          >
            {t('logout') || 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;