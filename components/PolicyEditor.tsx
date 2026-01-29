

import React, { useState, useEffect, useCallback } from 'react';
import { Policy, PolicyChecklist, ValidationCriterion, EvidenceType } from '../types';
import * as api from '../services/mockApiService';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';

// Healthcare 2025 Design System Colors
const colors = {
  primary: '#2C5F8D',
  primaryLight: '#4A90E2',
  success: '#28A745',
  neutral50: '#F8F9FA',
  neutral100: '#E9ECEF',
};

const evidenceTypes: EvidenceType[] = [
    'Clinical Note',
    'MRI / Imaging',
    'Stress Test / Cardiac Evidence',
    'Sleep Study / PSG Report',
    'Lab Results',
    'Other Documentation'
];

// Modern toggle switch component with 2025 design
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => {
    return (
        <label className="flex items-center cursor-pointer group" style={{ minHeight: '44px' }}>
            <div className="relative">
                <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={checked} 
                    onChange={(e) => onChange(e.target.checked)}
                    aria-label={checked ? 'Required criterion' : 'Optional criterion'}
                />
                <div 
                    className={`block w-16 h-9 rounded-full transition-all duration-300 ${checked ? 'bg-blue-600' : 'bg-gray-300'} group-hover:shadow-md`}
                    style={{ backgroundColor: checked ? colors.primaryLight : '#D1D5DB' }}
                ></div>
                <div className={`dot absolute left-1 top-1 bg-white w-7 h-7 rounded-full transition-transform duration-300 shadow-md ${checked ? 'transform translate-x-7' : ''}`}></div>
            </div>
            <span className="ml-3 font-semibold text-gray-800" style={{ fontSize: '15px' }}>
                {checked ? 'Required' : 'Optional'}
            </span>
        </label>
    );
};

interface PolicyEditorProps {
    initialPolicyId?: string;
}

export const PolicyEditor: React.FC<PolicyEditorProps> = ({ initialPolicyId }) => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
    const [checklist, setChecklist] = useState<PolicyChecklist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const fetchChecklist = useCallback(async (policyId: string) => {
        setIsLoading(true);
        const data = await api.getPolicyChecklist(policyId);
        setChecklist(data || null);
        setIsLoading(false);
    }, []);

    const handlePolicySelect = useCallback((policy: Policy) => {
        setSelectedPolicy(policy);
        fetchChecklist(policy.id);
    }, [fetchChecklist]);

    useEffect(() => {
        let isMounted = true;
        api.getPolicies().then(data => {
            if (isMounted) {
                setPolicies(data);
                if (initialPolicyId) {
                    const policyToSelect = data.find(p => p.id === initialPolicyId);
                    if (policyToSelect) {
                        handlePolicySelect(policyToSelect);
                    }
                }
                 setIsLoading(false);
            }
        });
        return () => { isMounted = false; };
    }, [initialPolicyId, handlePolicySelect]);


    const handleCriterionChange = (index: number, field: keyof ValidationCriterion, value: any) => {
        if (checklist) {
            const newCriteria = [...checklist.criteria];
            (newCriteria[index] as any)[field] = value;
            setChecklist({ ...checklist, criteria: newCriteria });
        }
    };
    
    const addCriterion = () => {
        if(checklist) {
            const newCriterion: ValidationCriterion = { 
                id: `new-${Date.now()}`, 
                text: '', 
                required: true, 
                evidence_type: 'Clinical Note' 
            };
            setChecklist({...checklist, criteria: [...checklist.criteria, newCriterion]});
        }
    };

    const removeCriterion = (index: number) => {
        if (checklist) {
            const newCriteria = checklist.criteria.filter((_, i) => i !== index);
            setChecklist({ ...checklist, criteria: newCriteria });
        }
    };

    const handleSave = async () => {
        if (checklist && selectedPolicy) {
            setIsSaving(true);
            await api.updateChecklist(selectedPolicy.id, checklist.criteria);
            setIsSaving(false);
            alert('Checklist updated successfully!');
        }
    };


    return (
        <div className="w-full max-w-7xl mx-auto space-y-6" style={{ fontFamily: "'Inter', 'Roboto', 'Open Sans', system-ui, sans-serif" }}>
            {/* Header */}
            <Card className="shadow-md border border-gray-200">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900" style={{ fontSize: '24px', lineHeight: '1.4' }}>
                                Policy Checklist Editor
                            </h1>
                            <p className="text-gray-600 mt-1" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Manage validation criteria for preauthorization policies
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Policy List Sidebar */}
                <Card className="lg:col-span-1 shadow-md border border-gray-200 lg:sticky lg:top-10" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-5 pb-4 border-b-2 border-blue-600">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h2 className="text-lg font-bold text-gray-900" style={{ fontSize: '18px' }}>Available Policies</h2>
                        </div>
                        {isLoading && policies.length === 0 ? (
                            <div className="flex justify-center py-10">
                                <Spinner />
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {policies.map(policy => (
                                    <li key={policy.id}>
                                        <button
                                            onClick={() => handlePolicySelect(policy)}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                                                selectedPolicy?.id === policy.id 
                                                    ? 'bg-blue-50 border-blue-400 shadow-md' 
                                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                            }`}
                                            style={{ minHeight: '44px' }}
                                            aria-pressed={selectedPolicy?.id === policy.id}
                                        >
                                            <p className={`font-semibold mb-1 ${selectedPolicy?.id === policy.id ? 'text-blue-900' : 'text-gray-900'}`} style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                                {policy.name}
                                            </p>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{policy.cpt_code}</span>
                                                <span>•</span>
                                                <span>{policy.payer}</span>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Card>

                {/* Checklist Editor Main Area */}
                <Card className="lg:col-span-2 shadow-md border border-gray-200">
                    {selectedPolicy ? (
                        <div className="p-6">
                            {/* Policy Header */}
                            <div className="mb-6 pb-5 border-b-2 border-blue-600">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontSize: '22px', lineHeight: '1.4' }}>
                                            {selectedPolicy.name}
                                        </h2>
                                        <p className="text-gray-600 mb-3" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                            {selectedPolicy.description}
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                CPT: {selectedPolicy.cpt_code}
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">
                                                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                {selectedPolicy.payer}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Spinner />
                                    <p className="mt-3 text-gray-600" style={{ fontSize: '16px' }}>Loading checklist...</p>
                                </div>
                            ) : checklist ? (
                                <div className="space-y-6">
                                    {/* Criteria List */}
                                    <div className="space-y-5">
                                        {checklist.criteria.map((item, index) => (
                                            <div key={item.id} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                                                {/* Criterion Number and Text */}
                                                <div className="flex items-start space-x-4 mb-5">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor={`criterion-${index}`} className="block font-semibold text-gray-900 mb-2" style={{ fontSize: '16px' }}>
                                                            Criterion Description
                                                        </label>
                                                        <textarea
                                                            id={`criterion-${index}`}
                                                            value={item.text}
                                                            onChange={(e) => handleCriterionChange(index, 'text', e.target.value)}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                            rows={3}
                                                            placeholder="Enter criterion description..."
                                                            style={{ fontSize: '16px', lineHeight: '1.6' }}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeCriterion(index)}
                                                        className="flex-shrink-0 w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors flex items-center justify-center"
                                                        style={{ minHeight: '44px', minWidth: '44px' }}
                                                        aria-label={`Remove criterion ${index + 1}`}
                                                    >
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Settings Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-14">
                                                    <div>
                                                        <label className="block font-semibold text-gray-900 mb-3" style={{ fontSize: '15px' }}>
                                                            Requirement Status
                                                        </label>
                                                        <ToggleSwitch 
                                                            checked={item.required} 
                                                            onChange={(checked) => handleCriterionChange(index, 'required', checked)} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`evidence-${index}`} className="block font-semibold text-gray-900 mb-3" style={{ fontSize: '15px' }}>
                                                            Evidence Type
                                                        </label>
                                                        <select
                                                            id={`evidence-${index}`}
                                                            value={item.evidence_type}
                                                            onChange={(e) => handleCriterionChange(index, 'evidence_type', e.target.value)}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                            style={{ fontSize: '16px', minHeight: '44px' }}
                                                        >
                                                            {evidenceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t-2 border-gray-200">
                                        <button
                                            onClick={addCriterion}
                                            className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                                            style={{ fontSize: '16px', minHeight: '48px' }}
                                            aria-label="Add new criterion"
                                        >
                                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add New Criterion
                                        </button>
                                        
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                            style={{ fontSize: '17px', minHeight: '52px' }}
                                            aria-label="Save all changes"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Spinner size="5" color="white" />
                                                    <span className="ml-2">Saving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Save All Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-600" style={{ fontSize: '16px' }}>No checklist found for this policy.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-32 text-center">
                            <svg className="h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-600 text-lg" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                                Select a policy from the sidebar to view and edit its checklist
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};