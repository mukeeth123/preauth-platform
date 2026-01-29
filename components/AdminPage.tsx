import React, { useState, useMemo } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { MOCK_POLICY_SOURCES } from '../services/mockData';
import { PolicySource } from '../types';

// Healthcare 2025 Design System Colors
const colors = {
  primary: '#2C5F8D',
  primaryLight: '#4A90E2',
  success: '#28A745',
  warning: '#FFA726',
  error: '#DC3545',
  neutral50: '#F8F9FA',
  neutral100: '#E9ECEF',
};

const payerOptions = [...new Set(MOCK_POLICY_SOURCES.map(p => p.payer))];

export const AdminPage: React.FC = () => {
    const [policySources, setPolicySources] = useState<PolicySource[]>(MOCK_POLICY_SOURCES);
    const [newSourceUrl, setNewSourceUrl] = useState('');
    const [newSourcePayer, setNewSourcePayer] = useState('Aetna'); // Default to first payer
    const [crawlFrequency, setCrawlFrequency] = useState('60');

    const handleTriggerCrawl = (type: 'Full' | 'Incremental') => {
        alert(`${type} policy crawl triggered successfully! (This is a mock action)`);
    };

    const handleAddSource = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSourceUrl.trim()) {
            alert('Please enter a valid URL.');
            return;
        }
        const newSource: PolicySource = {
            id: `ps-${Date.now()}`,
            payer: newSourcePayer,
            url: newSourceUrl,
        };
        setPolicySources([...policySources, newSource]);
        setNewSourceUrl('');
    };

    const handleRemoveSource = (id: string) => {
        if (window.confirm('Are you sure you want to remove this policy source?')) {
            setPolicySources(policySources.filter(source => source.id !== id));
        }
    };
    
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`File "${file.name}" uploaded for processing. (This is a mock action)`);
        }
    };

    const sourcesByPayer = useMemo(() => {
        return policySources.reduce((acc, source) => {
            if (!acc[source.payer]) {
                acc[source.payer] = [];
            }
            acc[source.payer].push(source);
            return acc;
        }, {} as Record<string, PolicySource[]>);
    }, [policySources]);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6" style={{ fontFamily: "'Inter', 'Roboto', 'Open Sans', system-ui, sans-serif" }}>
            {/* Header */}
            <Card className="shadow-md border border-gray-200">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900" style={{ fontSize: '24px', lineHeight: '1.4' }}>
                                Admin Control Panel
                            </h1>
                            <p className="text-gray-600 mt-1" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Manage policy sources, crawl schedules, and system configuration
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Crawl Controls */}
            <Card className="shadow-md border border-gray-200">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-5 pb-4 border-b-2 border-blue-600">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-900" style={{ fontSize: '20px', lineHeight: '1.4' }}>
                            Manual Crawl Controls
                        </h2>
                    </div>
                    <p className="text-gray-600 mb-5" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                        Trigger policy updates to sync the latest information from payer websites
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => handleTriggerCrawl('Full')}
                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            style={{ fontSize: '16px', minHeight: '48px' }}
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Trigger Full Policy Crawl
                        </button>
                        <button
                            onClick={() => handleTriggerCrawl('Incremental')}
                            className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                            style={{ fontSize: '16px', minHeight: '48px' }}
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Trigger Incremental Update
                        </button>
                    </div>
                </div>
            </Card>

            {/* Policy Source Management */}
            <Card className="shadow-md border border-gray-200">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-5 pb-4 border-b-2 border-blue-600">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-900" style={{ fontSize: '20px', lineHeight: '1.4' }}>
                            Policy Source Management
                        </h2>
                    </div>
                    
                    <div className="space-y-6 mb-8">
                        {Object.keys(sourcesByPayer).map((payer) => (
                            <div key={payer} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5">
                                <div className="flex items-center space-x-2 mb-4">
                                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <h3 className="text-lg font-bold text-gray-900" style={{ fontSize: '18px' }}>{payer}</h3>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                        {sourcesByPayer[payer].length} {sourcesByPayer[payer].length === 1 ? 'source' : 'sources'}
                                    </span>
                                </div>
                                <ul className="space-y-3">
                                    {sourcesByPayer[payer].map(source => (
                                        <li key={source.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group">
                                            <a 
                                                href={source.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium break-all flex-1"
                                                style={{ fontSize: '15px' }}
                                            >
                                                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                <span className="hover:underline">{source.url}</span>
                                            </a>
                                            <button
                                                onClick={() => handleRemoveSource(source.id)}
                                                className="ml-4 flex-shrink-0 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
                                                style={{ fontSize: '14px', minHeight: '36px' }}
                                                aria-label={`Remove ${source.url}`}
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddSource} className="border-t-2 border-gray-200 pt-6">
                        <div className="flex items-center space-x-2 mb-5">
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <h3 className="text-lg font-bold text-gray-900" style={{ fontSize: '18px' }}>Add New Policy Source</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-7">
                                <label htmlFor="new-source-url" className="block font-semibold text-gray-900 mb-2" style={{ fontSize: '15px' }}>
                                    Policy URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="new-source-url"
                                    type="url"
                                    value={newSourceUrl}
                                    onChange={(e) => setNewSourceUrl(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="https://example.com/policy-document"
                                    required
                                    style={{ fontSize: '16px', minHeight: '48px' }}
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label htmlFor="new-source-payer" className="block font-semibold text-gray-900 mb-2" style={{ fontSize: '15px' }}>
                                    Payer <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="new-source-payer"
                                    value={newSourcePayer}
                                    onChange={(e) => setNewSourcePayer(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    style={{ fontSize: '16px', minHeight: '48px' }}
                                >
                                    {payerOptions.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2 flex items-end">
                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                    style={{ fontSize: '16px', minHeight: '48px' }}
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Card>

            {/* Scheduling and Manual Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scheduling Controls */}
                <Card className="shadow-md border border-gray-200">
                    <div className="p-6">
                        <div className="flex items-center space-x-3 mb-5 pb-4 border-b-2 border-blue-600">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h2 className="text-xl font-bold text-gray-900" style={{ fontSize: '20px', lineHeight: '1.4' }}>
                                Scheduling Controls
                            </h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="crawl-frequency" className="block font-semibold text-gray-900 mb-3" style={{ fontSize: '16px' }}>
                                    Automatic Crawl Frequency
                                </label>
                                <select
                                    id="crawl-frequency"
                                    value={crawlFrequency}
                                    onChange={(e) => setCrawlFrequency(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    style={{ fontSize: '16px', minHeight: '48px' }}
                                >
                                    <option value="30">Every 30 days</option>
                                    <option value="60">Every 60 days</option>
                                    <option value="90">Every 90 days</option>
                                </select>
                            </div>
                            
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 space-y-3">
                                <div className="flex items-start space-x-3">
                                    <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800">Last Crawl</p>
                                        <p className="text-lg font-bold text-blue-900">
                                            {(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { 
                                                month: 'long', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800">Next Scheduled Crawl</p>
                                        <p className="text-lg font-bold text-green-900">
                                            {(new Date(Date.now() + Number(crawlFrequency) * 24 * 60 * 60 * 1000 - 15 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { 
                                                month: 'long', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Manual Policy Upload */}
                <Card className="shadow-md border border-gray-200">
                    <div className="p-6">
                        <div className="flex items-center space-x-3 mb-5 pb-4 border-b-2 border-blue-600">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <h2 className="text-xl font-bold text-gray-900" style={{ fontSize: '20px', lineHeight: '1.4' }}>
                                Manual Policy Upload
                            </h2>
                        </div>
                        
                        <p className="text-gray-600 mb-5" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                            Upload a single policy document in PDF or HTML format to be processed and added to the knowledge base.
                        </p>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all">
                            <div className="space-y-4">
                                <svg className="mx-auto h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <div>
                                    <label htmlFor="policy-upload" className="cursor-pointer">
                                        <span className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105">
                                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            Choose File to Upload
                                        </span>
                                        <input
                                            id="policy-upload"
                                            type="file"
                                            onChange={handleFileUpload}
                                            accept=".pdf,.html"
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="mt-3 text-gray-600" style={{ fontSize: '15px' }}>or drag and drop your file here</p>
                                </div>
                                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <svg className="h-4 w-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        PDF
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="h-4 w-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        HTML
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
