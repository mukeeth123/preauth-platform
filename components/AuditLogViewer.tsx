
import React, { useState, useEffect } from 'react';
import { CaseHistory, PreauthDecision } from '../types';
import * as api from '../services/mockApiService';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

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
};

const DecisionPill: React.FC<{ decision: PreauthDecision['decision'] }> = ({ decision }) => {
    const styles = {
        'Approved': { bg: colors.successBg, text: colors.success, border: colors.successBorder },
        'Denied': { bg: colors.errorBg, text: colors.error, border: colors.errorBorder },
        'Needs Review': { bg: colors.warningBg, text: colors.warning, border: colors.warningBorder }
    };
    const style = styles[decision];
    
    return (
        <span 
            className="px-3 py-1.5 rounded-full text-sm font-semibold border"
            style={{ 
                backgroundColor: style.bg, 
                color: style.text, 
                borderColor: style.border,
                fontSize: '14px'
            }}
        >
            {decision}
        </span>
    );
}

export const AuditLogViewer: React.FC = () => {
    const [history, setHistory] = useState<CaseHistory | null>(null);
    const [submissionLog, setSubmissionLog] = useState<Array<{ caseId: string; timestamp: Date; status: string; payer: string }>>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.getCaseHistory().then(data => {
            setHistory(data);
            setSubmissionLog(api.getSubmissionLog());
            setIsLoading(false);
        });
    }, []);
    
    const caseIds = history ? Object.keys(history).reverse() : [];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <Spinner />
                <p className="mt-4 text-gray-600" style={{ fontSize: '16px' }}>Loading audit history...</p>
            </div>
        );
    }
    
    if (!history || caseIds.length === 0) {
        return (
            <Card className="shadow-md border border-gray-200">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg className="h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontSize: '22px' }}>No Audit History</h2>
                    <p className="text-gray-600" style={{ fontSize: '16px', lineHeight: '1.5' }}>No cases have been processed yet. Submit a preauthorization to see it here.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6" style={{ fontFamily: "'Inter', 'Roboto', 'Open Sans', system-ui, sans-serif" }}>
            {/* Header */}
            <Card className="shadow-md border border-gray-200">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900" style={{ fontSize: '24px', lineHeight: '1.4' }}>
                                Case History & Audit Log
                            </h1>
                            <p className="text-gray-600 mt-1" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Track all preauthorization submissions and validation attempts
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
            
            {/* Recent Submissions */}
            {submissionLog.length > 0 && (
                <Card className="shadow-md border-2 border-green-200">
                    <div className="p-6">
                        <div className="flex items-center space-x-3 mb-5 pb-4 border-b-2 border-green-600">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900" style={{ fontSize: '20px', lineHeight: '1.4' }}>
                                    Recent Submissions to Payers
                                </h2>
                                <p className="text-sm text-gray-600">{submissionLog.length} {submissionLog.length === 1 ? 'submission' : 'submissions'} sent</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {submissionLog.slice().reverse().map((log, index) => (
                                <div 
                                    key={index} 
                                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            {submissionLog.length - index}
                                        </div>
                                        <div>
                                            <span className="font-mono font-bold text-gray-900" style={{ fontSize: '15px' }}>{log.caseId}</span>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-0.5">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                                <span className="font-medium">{log.payer}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 ml-11 sm:ml-0">
                                        <span className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-full font-semibold text-sm">
                                            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {log.status}
                                        </span>
                                        <span className="text-gray-500 text-sm font-medium">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            )}
            
            {/* Case History Timeline */}
            <Card className="shadow-md border border-gray-200">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-blue-600">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-900" style={{ fontSize: '20px', lineHeight: '1.4' }}>
                            Validation History Timeline
                        </h2>
                    </div>
                    
                    <div className="space-y-10">
                        {caseIds.map(caseId => (
                            <div key={caseId}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <h3 className="text-lg font-bold text-gray-900" style={{ fontSize: '18px' }}>
                                        Case ID: <span className="font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">{caseId}</span>
                                    </h3>
                                </div>
                                
                                <div className="border-l-4 border-gray-300 ml-3 pl-8 space-y-6">
                                    {history[caseId].map((attempt, index) => {
                                        const dotColor = 
                                            attempt.decision === 'Approved' ? colors.success :
                                            attempt.decision === 'Denied' ? colors.error :
                                            colors.warning;
                                        
                                        return (
                                            <div key={index} className="relative">
                                                <div 
                                                    className="absolute -left-[42px] w-6 h-6 rounded-full border-4 border-white shadow-md"
                                                    style={{ backgroundColor: dotColor }}
                                                ></div>
                                                
                                                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                                {index + 1}
                                                            </span>
                                                            <div>
                                                                <p className="font-bold text-gray-900" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                                                    {attempt.policy_name}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    Validation Attempt {index + 1}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <DecisionPill decision={attempt.decision} />
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                                <CheckIcon className="h-5 w-5 text-green-600"/>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-medium">Criteria Met</p>
                                                                <p className="text-lg font-bold text-green-600">{attempt.criteria_met.length}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-2">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                                <XIcon className="h-5 w-5 text-red-600"/>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-medium">Criteria Unmet</p>
                                                                <p className="text-lg font-bold text-red-600">{attempt.criteria_unmet.length}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-2">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-medium">Approval Score</p>
                                                                <p className="text-lg font-bold text-blue-600">{attempt.approval_probability_score}%</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};
