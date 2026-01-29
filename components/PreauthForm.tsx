
import React, { useState, useEffect, useRef } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { PreauthRequest, PreauthDecision, AiAssistData, Policy } from '../types';
import { MOCK_INITIAL_REQUESTS, MOCK_POLICIES } from '../services/mockData';
import * as api from '../services/mockApiService';
import { CheckIcon } from './icons/CheckIcon';

// Healthcare 2025 Design System Colors
const colors = {
  primary: '#2C5F8D',
  primaryLight: '#4A90E2',
  success: '#28A745',
  warning: '#FFA726',
  error: '#DC3545',
  neutral50: '#F8F9FA',
  neutral100: '#E9ECEF',
  neutral600: '#6C757D',
  neutral900: '#212529',
  white: '#FFFFFF',
};


// --- AI Assist Panel Component and Helpers (Inlined) ---

// Icons for modern healthcare UI
const DisclosureIcon: React.FC<{ open: boolean }> = ({ open }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ease-in-out ${open ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const SecurityBadge: React.FC = () => (
    <div className="inline-flex items-center space-x-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
        <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="font-medium">HIPAA Compliant</span>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between text-left font-semibold text-gray-800 py-3.5 hover:text-blue-600 transition-colors duration-200"
                aria-expanded={isOpen}
                style={{ fontSize: '16px', lineHeight: '1.5' }}
            >
                <span>{title}</span>
                <DisclosureIcon open={isOpen} />
            </button>
            {isOpen && <div className="pt-1 pb-4 animate-fade-in-sm">{children}</div>}
        </div>
    );
};


interface AiAssistPanelProps {
    policyName: string | null;
    tips: AiAssistData | null;
    isLoading: boolean;
    onInsertPhrase: (phrase: string) => void;
    onViewPolicy: () => void;
}

const AiAssistPanel: React.FC<AiAssistPanelProps> = ({ policyName, tips, isLoading, onInsertPhrase, onViewPolicy }) => {
    const hasTips = tips && !isLoading;

    return (
        <Card className="lg:sticky top-10 w-full shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h2 className="text-xl font-bold text-gray-900" style={{ fontSize: '20px', lineHeight: '1.5' }}>AI Assist</h2>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">LIVE</span>
            </div>
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
                    <Spinner />
                    <p className="mt-3 text-base text-gray-600" style={{ fontSize: '16px' }}>Analyzing your submission...</p>
                </div>
            )}
            {!isLoading && !policyName && (
                <div className="flex flex-col items-center justify-center h-96 text-center bg-gray-50 rounded-lg p-6">
                    <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-base text-gray-600" style={{ fontSize: '16px', lineHeight: '1.5' }}>Select a Payer and CPT Code to receive AI-powered guidance</p>
                </div>
            )}
            {hasTips && policyName && (
                <div className="space-y-0">
                    <Section title="📋 Policy Match" defaultOpen={true}>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <p className="font-semibold text-gray-900 mb-2" style={{ fontSize: '16px' }}>{policyName}</p>
                            <button 
                                onClick={onViewPolicy} 
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                style={{ fontSize: '14px', minHeight: '44px', minWidth: '44px' }}
                            >
                                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Full Policy Details
                            </button>
                        </div>
                    </Section>

                    <Section title="📄 Required Documentation" defaultOpen={true}>
                        {tips.recommended_evidence.length > 0 ? (
                             <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-start space-x-2 mb-3">
                                    <svg className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="font-semibold text-gray-900" style={{ fontSize: '16px' }}>Documents needed to be uploaded:</p>
                                </div>
                                <ul className="space-y-2.5 ml-7">
                                    {tips.recommended_evidence.map((item, i) => (
                                        <li key={i} className="text-gray-700 leading-relaxed" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                                            <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                                            {item.replace(/^\[AI Suggestion\]\s*/i, '')}
                                        </li>
                                    ))}
                                </ul>
                                {tips.evidence_explanation && (
                                    <div className="mt-4 pt-4 border-t border-orange-200">
                                        <p className="text-gray-700 italic" style={{ fontSize: '15px', lineHeight: '1.6' }}>&quot;{tips.evidence_explanation}&quot;</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-4">
                                <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <p className="text-green-800 font-medium" style={{ fontSize: '15px' }}>All required evidence appears to be documented</p>
                            </div>
                        )}
                    </Section>

                    <Section title="✨ Quick Insert Phrases" defaultOpen={true}>
                        <div className="space-y-2">
                            <p className="text-gray-600 text-sm mb-3" style={{ fontSize: '14px' }}>Click to insert into Clinical Justification:</p>
                            {tips.recommended_phrases_to_insert.map((phrase, i) => (
                                <button
                                    key={i}
                                    onClick={() => onInsertPhrase(phrase)}
                                    className="w-full text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                                    style={{ minHeight: '44px', fontSize: '15px', lineHeight: '1.5' }}
                                >
                                    <span className="flex items-center">
                                        <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-gray-700 group-hover:text-blue-700">&quot;{phrase}&quot;</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Section>

                    <Section title="💡 Expert Guidance" defaultOpen={true}>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-800 leading-relaxed" style={{ fontSize: '15px', lineHeight: '1.6' }}>{tips.contextual_coaching}</p>
                            </div>
                        </div>
                    </Section>
                </div>
            )}
        </Card>
    );
};


// --- Text Extraction Utilities ---

const getPdfjs = () => (window as any).pdfjsLib;
const getTesseract = () => (window as any).Tesseract;
const getMammoth = () => (window as any).mammoth;

const extractTextFromPdf = async (file: File): Promise<string> => {
  const pdfjsLib = getPdfjs();
  if (!pdfjsLib) throw new Error("pdf.js library is not loaded.");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@2.6.347/build/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ');
    text += '\n';
  }
  return text;
};

const extractTextFromImage = async (file: File, onProgress: (progress: number) => void): Promise<string> => {
  const Tesseract = getTesseract();
  if (!Tesseract) throw new Error("Tesseract.js library is not loaded.");
  const worker = await Tesseract.createWorker('eng', 1, {
    logger: (m: any) => {
      if (m.status === 'recognizing text') {
        onProgress(m.progress * 100);
      }
    },
  });
  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();
  return text;
};

const extractTextFromDocx = async (file: File): Promise<string> => {
    const mammoth = getMammoth();
    if (!mammoth) throw new Error("mammoth.js library is not loaded.");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

const extractTextFromTxt = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
};

const extractTextFromFile = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    const fileType = file.type;
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'application/pdf') {
        return extractTextFromPdf(file);
    } else if (fileType.startsWith('image/')) {
        return extractTextFromImage(file, onProgress || (() => {}));
    } else if (extension === 'docx' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return extractTextFromDocx(file);
    } else if (extension === 'doc' || fileType === 'application/msword') {
        return Promise.reject(new Error('.doc files are not supported. Please use .docx format.'));
    } else if (fileType === 'text/plain') {
        return extractTextFromTxt(file);
    } else {
        return Promise.reject(new Error(`Unsupported file type: ${fileType || extension}`));
    }
};

// --- Main Form Component ---

interface PreauthFormProps {
  onSubmit: (request: PreauthRequest) => Promise<void>;
  isLoading: boolean;
  initialData?: PreauthDecision;
  onNavigateToPolicy: (policyId: string) => void;
}

const payerOptions = ["Aetna", "Blue Cross", "Cigna", "UnitedHealthcare", "Humana", "Anthem"];
const cptOptions: { [key: string]: string[] } = {
    "Aetna": ["27447"],
    "Blue Cross": ["27130"],
    "Cigna": ["92928"],
    "UnitedHealthcare": ["93306"],
    "Humana": ["72148"],
    "Anthem": ["95810"]
};

const defaultState = {
    patient_id: '',
    patient_dob: '',
    icd10_code: '',
    provider_name: '',
    provider_npi: '',
    facility: 'Office' as PreauthRequest['facility'],
    urgency: 'Routine' as PreauthRequest['urgency'],
    planned_date: '',
    justification: '',
    attachmentText: ''
};

export const PreauthForm: React.FC<PreauthFormProps> = ({ onSubmit, isLoading, initialData, onNavigateToPolicy }) => {
  const [payer, setPayer] = useState(initialData?.original_request.payer || payerOptions[0]);
  const [cptCode, setCptCode] = useState(initialData?.original_request.cpt_code || cptOptions[payerOptions[0]][0]);
  const [caseId, setCaseId] = useState<string | undefined>(initialData?.case_id);
  
  // New fields
  const [patientId, setPatientId] = useState(initialData?.original_request.patient_id || '');
  const [patientDob, setPatientDob] = useState(initialData?.original_request.patient_dob || '');
  const [icd10Code, setIcd10Code] = useState(initialData?.original_request.icd10_code || '');
  const [providerName, setProviderName] = useState(initialData?.original_request.provider_name || '');
  const [providerNpi, setProviderNpi] = useState(initialData?.original_request.provider_npi || '');
  const [facility, setFacility] = useState<PreauthRequest['facility']>(initialData?.original_request.facility || 'Office');
  const [urgency, setUrgency] = useState<PreauthRequest['urgency']>(initialData?.original_request.urgency || 'Routine');
  const [plannedDate, setPlannedDate] = useState(initialData?.original_request.planned_date || '');
  
  const [justification, setJustification] = useState(initialData?.original_request.clinical_justification || '');
  const [attachmentText, setAttachmentText] = useState(initialData?.original_request.attachment_text || '');

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [extractionError, setExtractionError] = useState('');

  const justificationRef = useRef<HTMLTextAreaElement>(null);
  
  const [currentPolicy, setCurrentPolicy] = useState<Policy | null>(null);
  const [aiTips, setAiTips] = useState<AiAssistData | null>(null);
  const [isAssistLoading, setIsAssistLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      const { original_request, ai_improved_justification, ai_improved_attachment_text, case_id } = initialData;
      setPayer(original_request.payer);
      setCptCode(original_request.cpt_code);
      setPatientId(original_request.patient_id);
      setPatientDob(original_request.patient_dob);
      setIcd10Code(original_request.icd10_code);
      setProviderName(original_request.provider_name);
      setProviderNpi(original_request.provider_npi);
      setFacility(original_request.facility);
      setUrgency(original_request.urgency);
      setPlannedDate(original_request.planned_date);
      setJustification(ai_improved_justification);
      setAttachmentText(ai_improved_attachment_text);
      setCaseId(case_id);
    } else {
        // Pre-fill first option on initial load
        handlePrefill(cptOptions[payerOptions[0]][0]);
    }
  }, [initialData]);

  // Debounced effect for AI Assist
  useEffect(() => {
    const fetchTips = async () => {
      if (!cptCode || !payer) {
        setAiTips(null);
        setCurrentPolicy(null);
        return;
      }

      const policy = MOCK_POLICIES.find(p => p.payer === payer && p.cpt_code === cptCode) || null;
      setCurrentPolicy(policy);
      
      if (!policy || (!justification && !attachmentText)) {
          setAiTips(null);
          return;
      }
      
      setIsAssistLoading(true);
      const tips = await api.generateTips({
          payer,
          cpt_code: cptCode,
          patient_id: patientId,
          patient_dob: patientDob,
          icd10_code: icd10Code,
          provider_name: providerName,
          provider_npi: providerNpi,
          facility: facility,
          urgency: urgency,
          planned_date: plannedDate,
          clinical_justification: justification,
          attachment_text: attachmentText,
      });
      setAiTips(tips);
      setIsAssistLoading(false);
    };

    const handler = setTimeout(() => {
        fetchTips();
    }, 750);

    return () => {
        clearTimeout(handler);
    };
  }, [payer, cptCode, icd10Code, justification, attachmentText]);
  
  const resetAdditionalFields = (mockRequest?: Omit<PreauthRequest, 'case_id'>) => {
      setPatientId(mockRequest?.patient_id || defaultState.patient_id);
      setPatientDob(mockRequest?.patient_dob || defaultState.patient_dob);
      setIcd10Code(mockRequest?.icd10_code || defaultState.icd10_code);
      setProviderName(mockRequest?.provider_name || defaultState.provider_name);
      setProviderNpi(mockRequest?.provider_npi || defaultState.provider_npi);
      setFacility(mockRequest?.facility || defaultState.facility);
      setUrgency(mockRequest?.urgency || defaultState.urgency);
      setPlannedDate(mockRequest?.planned_date || defaultState.planned_date);
  }

  const handlePayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPayer = e.target.value;
    setPayer(newPayer);
    const newCpt = cptOptions[newPayer][0];
    setCptCode(newCpt);
    handlePrefill(newCpt);
    setCaseId(undefined);
  };
  
  const handlePrefill = (cpt: string) => {
      const mockRequest = MOCK_INITIAL_REQUESTS[cpt];
      if (mockRequest) {
          setJustification(mockRequest.clinical_justification);
          setAttachmentText(mockRequest.attachment_text);
          resetAdditionalFields(mockRequest);
          setFileName('');
          setExtractionError('');
      }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setFileName(file.name);
    setExtractionProgress(0);
    setExtractionError('');
    setAttachmentText('');

    try {
      const onProgress = (progress: number) => setExtractionProgress(progress);
      const text = await extractTextFromFile(file, onProgress);
      setAttachmentText(text);
    } catch (error: any) {
      console.error("Error extracting text:", error);
      setExtractionError(error.message || 'Failed to extract text from file.');
      setFileName('');
    } finally {
      setIsExtracting(false);
      setExtractionProgress(100);
    }
  };
  
  const handleInsertPhrase = (phrase: string) => {
    const textarea = justificationRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = textarea.value;
      const newText = currentText.substring(0, start) + ` ${phrase} ` + currentText.substring(end);
      setJustification(newText);
      
      setTimeout(() => {
        textarea.focus();
        const newCursorPosition = start + phrase.length + 2;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };
  
  const handleViewPolicy = () => {
      if (currentPolicy) {
          onNavigateToPolicy(currentPolicy.id);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      case_id: caseId,
      payer,
      cpt_code: cptCode,
      patient_id: patientId,
      patient_dob: patientDob,
      icd10_code: icd10Code,
      provider_name: providerName,
      provider_npi: providerNpi,
      facility: facility,
      urgency: urgency,
      planned_date: plannedDate,
      clinical_justification: justification,
      attachment_text: attachmentText,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start" style={{ fontFamily: "'Inter', 'Roboto', 'Open Sans', system-ui, sans-serif" }}>
        <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="w-full shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontSize: '24px', lineHeight: '1.4' }}>
                        {caseId ? `Resubmitting Case: ${caseId}` : 'New Preauthorization Request'}
                    </h1>
                    <SecurityBadge />
                </div>
                <p className="text-gray-600 mt-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                    Complete all required fields to validate your preauthorization request
                </p>
            </Card>

            {/* Main Form Card */}
            <Card className="w-full shadow-md border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section: Payer & Procedure Information */}
                <div className="space-y-5">
                    <div className="flex items-center space-x-2 pb-3 border-b-2 border-blue-600">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900" style={{ fontSize: '18px' }}>Payer & Procedure Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="payer" className="block font-medium text-gray-900 mb-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Insurance Payer <span className="text-red-500">*</span>
                            </label>
                            <select 
                                id="payer" 
                                value={payer} 
                                onChange={handlePayerChange} 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                style={{ fontSize: '16px', minHeight: '44px' }}
                                aria-required="true"
                            >
                                {payerOptions.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="cpt" className="block font-medium text-gray-900 mb-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                CPT Code <span className="text-red-500">*</span>
                            </label>
                            <select 
                                id="cpt" 
                                value={cptCode} 
                                disabled 
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                style={{ fontSize: '16px', minHeight: '44px' }}
                                aria-required="true"
                            >
                                {cptOptions[payer]?.map(cpt => <option key={cpt} value={cpt}>{cpt}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section: Patient Information */}
                <div className="space-y-5">
                    <div className="flex items-center space-x-2 pb-3 border-b-2 border-blue-600">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900" style={{ fontSize: '18px' }}>Patient Information</h3>
                        <SecurityBadge />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="patient_id" className="block font-medium text-gray-900 mb-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Patient ID
                            </label>
                            <input 
                                type="text" 
                                id="patient_id" 
                                value={patientId} 
                                onChange={e => setPatientId(e.target.value)} 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                style={{ fontSize: '16px', minHeight: '44px' }}
                                placeholder="Enter patient ID"
                            />
                        </div>
                        <div>
                            <label htmlFor="patient_dob" className="block font-medium text-gray-900 mb-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Date of Birth
                            </label>
                            <input 
                                type="date" 
                                id="patient_dob" 
                                value={patientDob} 
                                onChange={e => setPatientDob(e.target.value)} 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                style={{ fontSize: '16px', minHeight: '44px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Provider Information */}
                <div className="space-y-5">
                    <div className="flex items-center space-x-2 pb-3 border-b-2 border-blue-600">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900" style={{ fontSize: '18px' }}>Provider Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="provider_name" className="block font-medium text-gray-900 mb-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Provider Name
                            </label>
                            <input 
                                type="text" 
                                id="provider_name" 
                                value={providerName} 
                                onChange={e => setProviderName(e.target.value)} 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                style={{ fontSize: '16px', minHeight: '44px' }}
                                placeholder="Dr. Jane Smith"
                            />
                        </div>
                        <div>
                            <label htmlFor="provider_npi" className="block font-medium text-gray-900 mb-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Provider NPI
                            </label>
                            <input 
                                type="text" 
                                id="provider_npi" 
                                value={providerNpi} 
                                onChange={e => setProviderNpi(e.target.value)} 
                                pattern="\d{10}" 
                                title="NPI must be 10 digits" 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                style={{ fontSize: '16px', minHeight: '44px' }}
                                placeholder="1234567890"
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Service Details */}
                <div className="space-y-5">
                    <div className="flex items-center space-x-2 pb-3 border-b-2 border-blue-600">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900" style={{ fontSize: '18px' }}>Service Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="icd10_code" className="block font-medium text-gray-900 mb-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                ICD-10 Diagnosis Code
                            </label>
                            <input 
                                type="text" 
                                id="icd10_code" 
                                value={icd10Code} 
                                onChange={e => setIcd10Code(e.target.value)} 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                style={{ fontSize: '16px', minHeight: '44px' }}
                                placeholder="M17.11"
                            />
                        </div>
                        <div>
                            <label htmlFor="facility" className="block font-medium text-gray-900 mb-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Facility / Site of Service
                            </label>
                            <select 
                                id="facility" 
                                value={facility} 
                                onChange={e => setFacility(e.target.value as PreauthRequest['facility'])} 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                style={{ fontSize: '16px', minHeight: '44px' }}
                            >
                                <option value="Outpatient">Outpatient</option>
                                <option value="Inpatient">Inpatient</option>
                                <option value="Office">Office</option>
                                <option value="ASC">ASC</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="urgency" className="block font-medium text-gray-900 mb-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Request Urgency
                            </label>
                            <select 
                                id="urgency" 
                                value={urgency} 
                                onChange={e => setUrgency(e.target.value as PreauthRequest['urgency'])} 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                style={{ fontSize: '16px', minHeight: '44px' }}
                            >
                                <option value="Routine">Routine</option>
                                <option value="Expedited">Expedited</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="planned_date" className="block font-medium text-gray-900 mb-2" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                Planned Date of Service
                            </label>
                            <input 
                                type="date" 
                                id="planned_date" 
                                value={plannedDate} 
                                onChange={e => setPlannedDate(e.target.value)} 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                style={{ fontSize: '16px', minHeight: '44px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Clinical Justification */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-blue-600">
                        <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900" style={{ fontSize: '18px' }}>Clinical Justification</h3>
                            <span className="text-red-500 font-semibold">*</span>
                        </div>
                        {!initialData && (
                            <button 
                                type="button" 
                                onClick={() => handlePrefill(cptCode)} 
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                style={{ fontSize: '14px', minHeight: '44px', minWidth: '44px' }}
                            >
                                Prefill Sample Data
                            </button>
                        )}
                    </div>
                    <div>
                        <p className="text-gray-600 mb-3" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                            Provide detailed clinical notes, patient history, and medical justification for the requested procedure.
                        </p>
                        <textarea
                            ref={justificationRef}
                            id="justification"
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            rows={10}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y"
                            style={{ fontSize: '16px', lineHeight: '1.6', minHeight: '200px' }}
                            placeholder="Example: Patient presents with severe, chronic knee pain attributed to advanced osteoarthritis. Conservative treatments including physical therapy for 8 weeks and NSAIDs have provided minimal relief. Pain significantly impacts activities of daily living..."
                            aria-required="true"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">{justification.length} characters</span>
                            {justification.length > 0 && (
                                <span className="text-sm text-green-600 flex items-center">
                                    <CheckIcon className="h-4 w-4 mr-1" />
                                    Content provided
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section: Supporting Evidence Upload */}
                <div className="space-y-5">
                    <div className="flex items-center space-x-2 pb-3 border-b-2 border-blue-600">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900" style={{ fontSize: '18px' }}>Supporting Clinical Evidence</h3>
                        <span className="text-red-500 font-semibold">*</span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all duration-200">
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <svg className="h-16 w-16 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <label htmlFor="attachment_file" className="relative cursor-pointer">
                                    <span className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105" style={{ fontSize: '16px', minHeight: '44px' }}>
                                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Choose File to Upload
                                    </span>
                                    <input 
                                        id="attachment_file" 
                                        name="attachment_file" 
                                        type="file" 
                                        className="sr-only" 
                                        onChange={handleFileChange} 
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt" 
                                        disabled={isExtracting}
                                        aria-required="true"
                                    />
                                </label>
                                <p className="mt-3 text-gray-600" style={{ fontSize: '15px' }}>or drag and drop your file here</p>
                            </div>
                            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                    <svg className="h-4 w-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    PDF, DOCX, TXT
                                </span>
                                <span className="flex items-center">
                                    <svg className="h-4 w-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    PNG, JPG
                                </span>
                                <span className="flex items-center">
                                    <svg className="h-4 w-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Max 10MB
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {isExtracting && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <Spinner />
                                <p className="font-medium text-gray-900" style={{ fontSize: '16px' }}>Extracting text from {fileName}...</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out" 
                                    style={{ width: `${extractionProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 text-right">{Math.round(extractionProgress)}%</p>
                        </div>
                    )}
                    
                    {fileName && !isExtracting && !extractionError && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <CheckIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-gray-900" style={{ fontSize: '16px' }}>File uploaded successfully</p>
                                    <p className="text-sm text-gray-600">{fileName}</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={() => {
                                    setFileName('');
                                    setAttachmentText('');
                                }}
                                className="text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
                                style={{ minHeight: '44px', minWidth: '44px' }}
                                aria-label="Remove file"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {extractionError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                            <svg className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="font-medium text-red-900" style={{ fontSize: '16px' }}>Upload Error</p>
                                <p className="text-red-700 mt-1" style={{ fontSize: '15px' }}>{extractionError}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Section */}
                <div className="flex items-center justify-between pt-8 border-t-2 border-gray-200">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">All data is encrypted and HIPAA compliant</span>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || isExtracting || !justification.trim() || !attachmentText.trim()}
                        className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:shadow-none"
                        style={{ fontSize: '18px', minHeight: '56px', minWidth: '200px' }}
                    >
                        {isLoading || isExtracting ? (
                            <>
                                <Spinner size="6" color="white" />
                                <span className="ml-3">Processing...</span>
                            </>
                        ) : (
                            <>
                                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {caseId ? 'Resubmit Case' : 'Submit for Validation'}
                            </>
                        )}
                    </button>
                </div>
            </form>
            </Card>
        </div>
        
        {/* Sticky AI Assist Sidebar */}
        <div className="lg:col-span-1">
             <AiAssistPanel
                policyName={currentPolicy?.name || null}
                tips={aiTips}
                isLoading={isAssistLoading}
                onInsertPhrase={handleInsertPhrase}
                onViewPolicy={handleViewPolicy}
            />
        </div>
    </div>
  );
};