import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../services/apiService';

const BlockchainVerification = ({ entityType, entityId, hash, txId }) => {
  const { t } = useTranslation();
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (hash && txId) {
      verifyHash();
    }
  }, [hash, txId]);

  const verifyHash = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/blockchain/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ hash, tx_id: txId })
      });
      
      const data = await response.json();
      setVerificationStatus(data.verified ? 'verified' : 'failed');
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusText = () => {
    switch (verificationStatus) {
      case 'verified':
        return t('blockchainVerified') || 'Blockchain Verified';
      case 'failed':
        return t('verificationFailed') || 'Verification Failed';
      case 'pending':
        return t('verificationPending') || 'Verification Pending';
      case 'error':
        return t('verificationError') || 'Verification Error';
      default:
        return t('unknown') || 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'verified':
        return 'text-green-700 bg-green-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <div className="flex items-center">
        {isVerifying ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
        ) : (
          getStatusIcon()
        )}
      </div>
      
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      
      {hash && (
        <div className="text-xs text-gray-500 font-mono">
          {t('hash')}: {hash.substring(0, 8)}...{hash.substring(hash.length - 8)}
        </div>
      )}
      
      {txId && !txId.startsWith('dev_') && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary-600 hover:text-primary-800"
        >
          {t('viewOnBlockchain') || 'View on Sepolia'}
        </a>
      )}
    </div>
  );
};

export default BlockchainVerification;