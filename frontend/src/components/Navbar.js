import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiService from '../services/apiService';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('access_token');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.body.className = newLang === 'ar' ? 'font-arabic' : 'font-english';
  };

  const handleLogout = () => {
    apiService.logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActivePath(to)
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand / الشعار والعلامة التجارية */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">AidTrace</span>
                <span className="text-xs text-gray-600">
                  {i18n.language === 'ar' ? 'تتبع المساعدات' : 'South Sudan'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation / التنقل على سطح المكتب */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {!isAuthenticated ? (
              <>
                <NavLink to="/">{t('home')}</NavLink>
                <NavLink to="/about">{t('about')}</NavLink>
                <NavLink to="/how-it-works">{t('howItWorks')}</NavLink>
                <NavLink to="/projects">{t('projects')}</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard">{t('dashboard')}</NavLink>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm text-gray-600">
                    {user.first_name || user.username}
                  </span>
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                    {t(user.role)}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800 px-3 py-2 rounded-md"
                  >
                    {t('logout')}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <NavLink to="/login">{t('login')}</NavLink>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  {t('register')}
                </Link>
              </div>
            )}
            
            {/* Language Toggle / تبديل اللغة */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
            >
              <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button / زر القائمة المحمولة */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600"
            >
              <span className="text-sm">{i18n.language === 'en' ? 'ع' : 'EN'}</span>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu / قائمة التنقل المحمولة */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {!isAuthenticated ? (
                <>
                  <NavLink to="/" onClick={() => setIsMenuOpen(false)}>{t('home')}</NavLink>
                  <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>{t('about')}</NavLink>
                  <NavLink to="/how-it-works" onClick={() => setIsMenuOpen(false)}>{t('howItWorks')}</NavLink>
                  <NavLink to="/projects" onClick={() => setIsMenuOpen(false)}>{t('projects')}</NavLink>
                  <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>{t('login')}</NavLink>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                  >
                    {t('register')}
                  </Link>
                </>
              ) : (
                <>
                  <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>{t('dashboard')}</NavLink>
                  <div className="px-3 py-2 text-sm text-gray-600">
                    {user.first_name || user.username} ({t(user.role)})
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-800"
                  >
                    {t('logout')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;