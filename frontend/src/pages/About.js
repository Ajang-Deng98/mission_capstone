import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const About = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {i18n.language === 'ar' ? 'حول منصة AidTrace' : 'About AidTrace'}
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            {i18n.language === 'ar' 
              ? 'منصة شفافة لتتبع المساعدات الإنسانية في جنوب السودان باستخدام تقنية البلوك تشين'
              : 'Transparent platform for tracking humanitarian aid in South Sudan using blockchain technology'
            }
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {i18n.language === 'ar' ? 'مهمتنا' : 'Our Mission'}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {i18n.language === 'ar' 
                ? 'تهدف منصة AidTrace إلى تعزيز الشفافية والمساءلة في توزيع المساعدات الإنسانية في جنوب السودان من خلال استخدام تقنية البلوك تشين والحلول الرقمية المبتكرة. نربط بين المتبرعين والمنظمات والموظفين الميدانيين لضمان وصول المساعدات إلى المستحقين بكفاءة وشفافية كاملة.'
                : 'AidTrace aims to enhance transparency and accountability in humanitarian aid distribution in South Sudan through blockchain technology and innovative digital solutions. We connect donors, organizations, and field officers to ensure aid reaches those in need with complete efficiency and transparency.'
              }
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {i18n.language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {i18n.language === 'ar' 
                ? 'نسعى لأن نكون المنصة الرائدة في جنوب السودان لتتبع المساعدات الإنسانية، حيث يمكن لكل متبرع رؤية تأثير مساهمته، ولكل منظمة إدارة مشاريعها بكفاءة، ولكل مستفيد الحصول على المساعدة التي يستحقها.'
                : 'We strive to be the leading platform in South Sudan for tracking humanitarian aid, where every donor can see the impact of their contribution, every organization can manage projects efficiently, and every beneficiary receives the aid they deserve.'
              }
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {i18n.language === 'ar' ? 'قيمنا الأساسية' : 'Our Core Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {i18n.language === 'ar' ? 'الشفافية' : 'Transparency'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ar' 
                  ? 'تتبع كامل لجميع المعاملات والتقارير باستخدام تقنية البلوك تشين'
                  : 'Complete tracking of all transactions and reports using blockchain'
                }
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {i18n.language === 'ar' ? 'المساءلة' : 'Accountability'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ar' 
                  ? 'كل طرف مسؤول عن دوره في عملية توزيع المساعدات'
                  : 'Every party is accountable for their role in aid distribution'
                }
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {i18n.language === 'ar' ? 'التعاون' : 'Collaboration'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ar' 
                  ? 'منصة موحدة تجمع جميع الأطراف المعنية'
                  : 'Unified platform bringing all stakeholders together'
                }
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {i18n.language === 'ar' ? 'الابتكار' : 'Innovation'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ar' 
                  ? 'استخدام أحدث التقنيات لحل التحديات الإنسانية'
                  : 'Using latest technology to solve humanitarian challenges'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-primary-600 rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            {i18n.language === 'ar' ? 'إنجازاتنا' : 'Our Impact'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-xl text-primary-100">{i18n.language === 'ar' ? 'منظمة مسجلة' : 'Registered Organizations'}</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-xl text-primary-100">{i18n.language === 'ar' ? 'مشروع نشط' : 'Active Projects'}</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">$2M+</div>
              <div className="text-xl text-primary-100">{i18n.language === 'ar' ? 'تمويل موزع' : 'Funds Distributed'}</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-xl text-primary-100">{i18n.language === 'ar' ? 'مستفيد' : 'Beneficiaries'}</div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {i18n.language === 'ar' ? 'التقنيات المستخدمة' : 'Technology Stack'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">React</div>
              <p className="text-gray-600 text-sm">{i18n.language === 'ar' ? 'واجهة المستخدم' : 'Frontend'}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">Django</div>
              <p className="text-gray-600 text-sm">{i18n.language === 'ar' ? 'الخادم' : 'Backend'}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">PostgreSQL</div>
              <p className="text-gray-600 text-sm">{i18n.language === 'ar' ? 'قاعدة البيانات' : 'Database'}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">Ethereum</div>
              <p className="text-gray-600 text-sm">{i18n.language === 'ar' ? 'البلوك تشين' : 'Blockchain'}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {i18n.language === 'ar' ? 'انضم إلينا اليوم' : 'Join Us Today'}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {i18n.language === 'ar' 
              ? 'كن جزءاً من التغيير وساهم في تحسين حياة الآلاف في جنوب السودان'
              : 'Be part of the change and help improve lives of thousands in South Sudan'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {i18n.language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
            </Link>
            <Link
              to="/how-it-works"
              className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              {i18n.language === 'ar' ? 'تعرف على المزيد' : 'Learn More'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;