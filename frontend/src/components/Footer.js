import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">AidTrace</h3>
                <p className="text-sm text-gray-400">
                  {i18n.language === 'ar' ? 'تتبع المساعدات جنوب السودان' : 'South Sudan'}
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {i18n.language === 'ar' 
                ? 'منصة شفافة لتتبع المساعدات الإنسانية في جنوب السودان باستخدام تقنية البلوك تشين'
                : 'Transparent platform for tracking humanitarian aid in South Sudan using blockchain technology'
              }
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="https://sepolia.etherscan.io/" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors">
                {t('viewOnEtherscan')}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">{t('home')}</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">{t('about')}</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">{t('howItWorks')}</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-white transition-colors">{t('projects')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('support')}</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">{t('login')}</Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">{t('register')}</Link></li>
              <li><span className="text-gray-300">{t('helpCenter')}</span></li>
              <li><span className="text-gray-300">{t('contactUs')}</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 AidTrace South Sudan. {t('allRightsReserved')}.
            </div>
            <div className="flex space-x-6 rtl:space-x-reverse text-sm">
              <span className="text-gray-400">{t('privacyPolicy')}</span>
              <span className="text-gray-400">{t('termsOfService')}</span>
              <span className="text-gray-400">
                {t('blockchainNetwork')}: {t('sepoliaTestnet')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;