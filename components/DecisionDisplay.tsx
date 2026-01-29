
import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { PreauthDecision } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface DecisionDisplayProps {
  decision: PreauthDecision;
  onResubmit: (decision: PreauthDecision) => void;
  onNewRequest: () => void;
  onSubmit: (decision: PreauthDecision) => void;
}

// Healthcare 2025 Design System Colors
const colors = {
  success: '#28A745',
  successBg: '#F0FDF4',
  successBorder: '#86EFAC',
  error: '#DC3545',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  warning: '#FFA726',
  warningBg: '#FFF7ED',
  warningBorder: '#FED7AA',
  info: '#4A90E2',
  infoBg: '#EFF6FF',
  infoBorder: '#BFDBFE',
  neutral: '#F5F5F5',
  neutralBorder: '#E9ECEF',
};

const getStatusColorClasses = (status: PreauthDecision['decision']) => {
  switch (status) {
    case 'Approved':
      return {
        bg: colors.successBg,
        text: colors.success,
        border: colors.successBorder,
        progress: colors.success,
        icon: '✓',
      };
    case 'Denied':
      return {
        bg: colors.errorBg,
        text: colors.error,
        border: colors.errorBorder,
        progress: colors.error,
        icon: '✕',
      };
    case 'Needs Review':
      return {
        bg: colors.warningBg,
        text: colors.warning,
        border: colors.warningBorder,
        progress: colors.warning,
        icon: '⚠',
      };
    default:
      return {
        bg: colors.neutral,
        text: '#6C757D',
        border: colors.neutralBorder,
        progress: '#6C757D',
        icon: 'ℹ',
      };
  }
};

const getStatusDisplayLabel = (status: PreauthDecision['decision']) => {
  switch (status) {
    case 'Approved':
      return 'Request Appears Well-Supported';
    case 'Denied':
      return 'Request Lacks Key Supporting Criteria';
    case 'Needs Review':
      return 'Request May Benefit From Additional Detail';
    default:
      return status;
  }
};

const ApprovalGauge: React.FC<{ score: number, colorValue: string }> = ({ score, colorValue }) => {
    const circumference = 2 * Math.PI * 58;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="58" strokeWidth="14" stroke="#E9ECEF" fill="transparent" />
                <circle 
                    cx="70" 
                    cy="70" 
                    r="58" 
                    strokeWidth="14" 
                    stroke={colorValue}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-in-out"
                    strokeLinecap="round" 
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold" style={{ color: colorValue }}>{score}%</span>
                <span className="text-xs font-medium text-gray-600 mt-1">Approval</span>
                <span className="text-xs font-medium text-gray-600">Probability</span>
            </div>
        </div>
    );
};


export const DecisionDisplay: React.FC<DecisionDisplayProps> = ({ decision, onResubmit, onNewRequest, onSubmit }) => {
  const statusColors = getStatusColorClasses(decision.decision);
  const displayLabel = getStatusDisplayLabel(decision.decision);
  const [showAllCriteria, setShowAllCriteria] = useState(false);
  
  const failedCriteria = decision.validation_checklist.filter(item => item.status === 'unmet');
  const passedCriteria = decision.validation_checklist.filter(item => item.status === 'met');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in" style={{ fontFamily: "'Inter', 'Open Sans', 'Lato', system-ui, sans-serif" }}>
      
      {/* Header Card with Status */}
      <Card className="shadow-lg border-2" style={{ borderColor: statusColors.border }}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-4xl" role="img" aria-label="Status icon">{statusColors.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-600" style={{ fontSize: '14px' }}>Case ID: <span className="font-mono font-semibold">{decision.case_id}</span></p>
                <h1 className="text-3xl font-bold mt-1" style={{ color: statusColors.text, fontSize: '28px', lineHeight: '1.3' }}>
                  {displayLabel}
                </h1>
              </div>
            </div>
            <p className="text-gray-700 font-medium mt-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
              {decision.policy_name}
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-700">{passedCriteria.length} Criteria Met</span>
              </div>
              {failedCriteria.length > 0 && (
                <div className="flex items-center space-x-2">
                  <XIcon className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-semibold text-gray-700">{failedCriteria.length} Criteria Unmet</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <ApprovalGauge score={decision.approval_probability_score} colorValue={statusColors.progress} />
          </div>
        </div>
      </Card>

      {/* Information Banner for Additional Documentation */}
      {decision.decision !== 'Approved' && failedCriteria.length > 0 && (
        <Card className="shadow-md border-l-4" style={{ borderLeftColor: colors.info, backgroundColor: colors.infoBg }}>
          <div className="flex items-start space-x-4 p-6">
            <svg className="h-8 w-8 flex-shrink-0 mt-1" style={{ color: colors.info }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontSize: '20px', lineHeight: '1.4' }}>
                Additional Documentation Required
              </h3>
              <p className="text-gray-700 mb-4" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                Your request is missing {failedCriteria.length} required {failedCriteria.length === 1 ? 'criterion' : 'criteria'}. Review the failed items below and use our AI-powered suggestions to strengthen your submission.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* AI-Improved Recommendations */}
      {decision.decision !== 'Approved' && (
        <Card className="shadow-md border border-blue-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900" style={{ fontSize: '20px', lineHeight: '1.4' }}>
                AI-Improved Justification & Recommendations
              </h3>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 mb-5">
              <p className="text-gray-800 italic leading-relaxed" style={{ fontSize: '16px', lineHeight: '1.7' }}>
                &quot;{decision.ai_improved_justification}&quot;
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 flex items-center space-x-2" style={{ fontSize: '18px' }}>
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>Recommended Actions:</span>
              </h4>
              <ul className="space-y-3">
                {decision.recommended_actions.map((action, index) => (
                  <li key={index} className="flex items-start space-x-3 bg-white border border-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-800 flex-1" style={{ fontSize: '16px', lineHeight: '1.6' }}>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Failed Criteria - Prominent Display */}
      {failedCriteria.length > 0 && (
        <Card className="shadow-md border-2 border-red-300">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-5">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900" style={{ fontSize: '20px', lineHeight: '1.4' }}>
                  Criteria Requiring Attention ({failedCriteria.length})
                </h3>
                <p className="text-sm text-red-700">These items must be addressed before submission</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {failedCriteria.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-red-50 border-2 border-red-200 rounded-xl p-5 hover:shadow-lg transition-all"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      <XIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-red-900 mb-2" style={{ fontSize: '17px', lineHeight: '1.5' }}>
                        {item.criterion}
                      </p>
                      <div className="flex items-start space-x-2 bg-white border border-red-200 rounded-lg p-3">
                        <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-red-800 flex-1" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                          {item.evidence_notes}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Passed Criteria - Collapsible Section */}
      {passedCriteria.length > 0 && (
        <Card className="shadow-md border border-green-200">
          <div className="p-6">
            <button
              onClick={() => setShowAllCriteria(!showAllCriteria)}
              className="w-full flex items-center justify-between hover:bg-green-50 -m-6 p-6 rounded-t-lg transition-colors"
              style={{ minHeight: '44px' }}
              aria-expanded={showAllCriteria}
              aria-controls="passed-criteria-list"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-green-900" style={{ fontSize: '20px', lineHeight: '1.4' }}>
                    Criteria Successfully Met ({passedCriteria.length})
                  </h3>
                  <p className="text-sm text-green-700">Click to {showAllCriteria ? 'hide' : 'view'} details</p>
                </div>
              </div>
              <svg 
                className={`h-6 w-6 text-green-600 transition-transform duration-200 ${showAllCriteria ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showAllCriteria && (
              <div id="passed-criteria-list" className="mt-6 space-y-4 animate-fade-in">
                {passedCriteria.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center">
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-900 mb-1" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                          {item.criterion}
                        </p>
                        <p className="text-green-700 text-sm" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                          {item.evidence_notes}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Action Buttons */}
      <Card className="shadow-md border border-gray-200 sticky bottom-0 z-10">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              onClick={onNewRequest}
              className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              style={{ fontSize: '16px', minHeight: '48px' }}
              aria-label="Return to preauthorization form"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Preauthorization
            </button>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {decision.decision !== 'Approved' && (
                <button
                  onClick={() => onResubmit(decision)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  style={{ fontSize: '16px', minHeight: '48px' }}
                  aria-label="Apply AI suggestions and resubmit case"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Apply AI Suggestions & Resubmit
                </button>
              )}
              
              <button
                onClick={() => onSubmit(decision)}
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                style={{ fontSize: '17px', minHeight: '52px' }}
                aria-label="Submit preauthorization to payer"
              >
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Preauthorization
              </button>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="flex items-center justify-center space-x-2 mt-4 text-gray-600">
            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">All submissions are encrypted and HIPAA compliant</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
