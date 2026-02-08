import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const { t, i18n } = useTranslation();

  const steps = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: i18n.language === 'ar' ? 'تسجيل المنظمات' : 'Organization Registration',
      description: i18n.language === 'ar' 
        ? 'المنظمات الإنسانية تسجل في المنصة وتنشئ مشاريع المساعدات'
        : 'Humanitarian organizations register and create aid projects',
      details: i18n.language === 'ar' 
        ? 'المنظمات تحدد الأهداف والميزانيات والمواقع المستهدفة'
        : 'Organizations define objectives, budgets, and target locations'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: i18n.language === 'ar' ? 'تمويل المشاريع' : 'Project Funding',
      description: i18n.language === 'ar' 
        ? 'المتبرعون يتصفحون المشاريع ويقدمون التمويل'
        : 'Donors browse projects and provide funding',
      details: i18n.language === 'ar' 
        ? 'جميع التبرعات مسجلة ومتتبعة بشفافية كاملة'
        : 'All donations are recorded and tracked with full transparency'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: i18n.language === 'ar' ? 'التنفيذ الميداني' : 'Field Implementation',
      description: i18n.language === 'ar' 
        ? 'الموظفون الميدانيون ينفذون المشاريع ويسجلون التوزيعات'
        : 'Field officers implement projects and record distributions',
      details: i18n.language === 'ar' 
        ? 'تسجيل مفصل لتوزيع المساعدات والمستفيدين'
        : 'Detailed recording of aid distribution and beneficiaries'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: i18n.language === 'ar' ? 'التوثيق بالبلوك تشين' : 'Blockchain Verification',
      description: i18n.language === 'ar' 
        ? 'جميع المعاملات والتقارير موثقة على البلوك تشين'
        : 'All transactions and reports verified on blockchain',
      details: i18n.language === 'ar' 
        ? 'ضمان عدم التلاعب والشفافية الكاملة'
        : 'Ensuring tamper-proof records and complete transparency'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {i18n.language === 'ar' ? 'كيفية عمل المنصة' : 'How AidTrace Works'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {i18n.language === 'ar' 
              ? 'عملية بسيطة وشفافة لضمان وصول المساعدات إلى المحتاجين'
              : 'A simple and transparent process to ensure aid reaches those in need'
            }
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className={`flex items-center ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4 rtl:ml-4 rtl:mr-0">
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-primary-600 mb-1">
                        {i18n.language === 'ar' ? `الخطوة ${index + 1}` : `Step ${index + 1}`}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 mb-4">
                    {step.description}
                  </p>
                  <p className="text-gray-600">
                    {step.details}
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0 w-24 flex justify-center">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {i18n.language === 'ar' ? 'الميزات الرئيسية' : 'Key Features'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {i18n.language === 'ar' ? 'يعمل بدون إنترنت' : 'Offline Capable'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ar' 
                  ? 'استمر في العمل حتى بدون اتصال بالإنترنت'
                  : 'Continue working even without internet connection'
                }
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {i18n.language === 'ar' ? 'دعم اللغة العربية' : 'Arabic Support'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ar' 
                  ? 'واجهة كاملة باللغة العربية مع دعم الكتابة من اليمين لليسار'
                  : 'Full Arabic interface with right-to-left text support'
                }
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {i18n.language === 'ar' ? 'سريع وآمن' : 'Fast & Secure'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ar' 
                  ? 'تقنيات حديثة لضمان الأمان والسرعة'
                  : 'Modern technologies ensuring security and speed'
                }
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-primary-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {i18n.language === 'ar' ? 'ابدأ رحلتك معنا' : 'Start Your Journey'}
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            {i18n.language === 'ar' 
              ? 'انضم إلى منصة AidTrace وساهم في تحسين حياة الآخرين'
              : 'Join AidTrace and help improve lives of others'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {i18n.language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
            </Link>
            <Link
              to="/projects"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              {i18n.language === 'ar' ? 'تصفح المشاريع' : 'Browse Projects'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;