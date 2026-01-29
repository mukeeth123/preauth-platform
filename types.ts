



export type EvidenceType =
  | 'Clinical Note'
  | 'MRI / Imaging'
  | 'Stress Test / Cardiac Evidence'
  | 'Sleep Study / PSG Report'
  | 'Lab Results'
  | 'Other Documentation';

export interface ValidationCriterion {
  id: string;
  text: string;
  required: boolean;
  evidence_type: EvidenceType;
}

export interface PolicyChecklist {
  policyId: string;
  criteria: ValidationCriterion[];
}

export interface ValidationChecklistEntry {
  criterion: string;
  status: 'met' | 'unmet' | 'pending';
  evidence_notes: string;
}

export interface PreauthRequest {
  case_id?: string;
  payer: string;
  cpt_code: string;
  patient_id: string;
  patient_dob: string;
  icd10_code: string;
  provider_name: string;
  provider_npi: string;
  facility: 'Outpatient' | 'Inpatient' | 'Office' | 'ASC';
  urgency: 'Routine' | 'Expedited';
  planned_date: string;
  clinical_justification: string;
  attachment_text: string;
}

export interface PreauthDecision {
  case_id: string;
  decision: 'Approved' | 'Denied' | 'Needs Review';
  approval_probability_score: number;
  policy_name: string;
  criteria_met: string[];
  criteria_unmet: string[];
  validation_checklist: ValidationChecklistEntry[];
  ai_improved_justification: string;
  ai_improved_attachment_text: string;
  recommended_actions: string[];
  can_resubmit_without_new_case: boolean;
  original_request: PreauthRequest;
}

export interface Policy {
  id: string;
  name: string;
  payer: string;
  cpt_code: string;
  description: string;
}

export interface CaseHistory {
  [caseId: string]: PreauthDecision[];
}

export type UserRole = 'standard' | 'admin' | 'policy_ops';

export interface PolicySource {
    id: string;
    payer: string;
    url: string;
}

export interface AiAssistData {
  recommended_evidence: string[];
  evidence_explanation: string;
  recommended_phrases_to_insert: string[];
  contextual_coaching: string;
}

export interface AiAssistRequest {
  payer: string;
  cpt_code: string;
  icd10_code: string;
  clinical_justification: string;
  attachment_text: string;
  policy_criteria: ValidationCriterion[];
}