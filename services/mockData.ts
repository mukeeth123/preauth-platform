


import { Policy, PolicyChecklist, PreauthRequest, PolicySource } from '../types';

export const MOCK_POLICIES: Policy[] = [
  { id: 'policy-1', name: 'Aetna Ortho Policy 1.2', payer: 'Aetna', cpt_code: '27447', description: 'Total Knee Replacement' },
  { id: 'policy-2', name: 'Blue Cross Ortho Policy 2.1', payer: 'Blue Cross', cpt_code: '27130', description: 'Total Hip Replacement' },
  { id: 'policy-3', name: 'Cigna Cardio Policy 3.0', payer: 'Cigna', cpt_code: '92928', description: 'Coronary Stent (PCI)' },
  { id: 'policy-4', name: 'UnitedHealthcare Imaging Policy 4.5', payer: 'UnitedHealthcare', cpt_code: '93306', description: 'Transthoracic Echo' },
  { id: 'policy-5', name: 'Humana Imaging Policy 5.1', payer: 'Humana', cpt_code: '72148', description: 'MRI Lumbar Spine' },
  { id: 'policy-6', name: 'Anthem Sleep Policy 6.0', payer: 'Anthem', cpt_code: '95810', description: 'Sleep Study (OSA)' },
];

export const MOCK_CHECKLISTS: PolicyChecklist[] = [
  {
    policyId: 'policy-1', // Knee Replacement
    criteria: [
      { id: 'p1c1', text: 'Documented failure of conservative therapy for at least 6 weeks.', required: true, evidence_type: 'Clinical Note' },
      { id: 'p1c2', text: 'Radiographic evidence of advanced joint disease (Kellgren-Lawrence grade 3-4).', required: true, evidence_type: 'MRI / Imaging' },
      { id: 'p1c3', text: 'Pain and functional disability that significantly impacts activities of daily living.', required: true, evidence_type: 'Clinical Note' },
      { id: 'p1c4', text: 'Patient is medically cleared for surgery.', required: false, evidence_type: 'Other Documentation' },
    ],
  },
   {
    policyId: 'policy-2', // Hip Replacement
    criteria: [
      { id: 'p2c1', text: 'Advanced hip osteoarthritis confirmed by imaging.', required: true, evidence_type: 'MRI / Imaging' },
      { id: 'p2c2', text: 'Failure of at least 3 months of non-operative management.', required: true, evidence_type: 'Clinical Note' },
      { id: 'p2c3', text: 'Persistent pain that limits mobility and quality of life.', required: true, evidence_type: 'Clinical Note' },
    ],
  },
  {
    policyId: 'policy-3', // Stent
    criteria: [
      { id: 'p3c1', text: 'Significant stenosis (>70%) in a major coronary artery.', required: true, evidence_type: 'Stress Test / Cardiac Evidence' },
      { id: 'p3c2', text: 'Evidence of myocardial ischemia (e.g., positive stress test).', required: true, evidence_type: 'Stress Test / Cardiac Evidence' },
      { id: 'p3c3', text: 'Patient has stable or unstable angina.', required: true, evidence_type: 'Clinical Note' },
    ],
  },
  {
    policyId: 'policy-4', // Echo
    criteria: [
      { id: 'p4c1', text: 'Evaluation of suspected heart failure.', required: true, evidence_type: 'Clinical Note' },
      { id: 'p4c2', text: 'Assessment of valvular heart disease.', required: true, evidence_type: 'Clinical Note' },
      { id: 'p4c3', text: 'Monitoring of known cardiac condition.', required: false, evidence_type: 'Clinical Note' },
    ],
  },
   {
    policyId: 'policy-5', // MRI Lumbar
    criteria: [
      { id: 'p5c1', text: 'Radicular pain or neurological deficit present.', required: true, evidence_type: 'Clinical Note' },
      { id: 'p5c2', text: 'Symptoms persist after 6 weeks of conservative care.', required: true, evidence_type: 'Clinical Note' },
      { id: 'p5c3', text: 'Red flag symptoms (e.g., cauda equina syndrome) are absent.', required: true, evidence_type: 'Clinical Note' },
    ],
  },
  {
    policyId: 'policy-6', // Sleep Study
    criteria: [
      { id: 'p6c1', text: 'High pre-test probability of moderate to severe OSA.', required: true, evidence_type: 'Clinical Note' },
      { id: 'p6c2', text: 'Symptoms include excessive daytime sleepiness, witnessed apneas, or loud snoring.', required: true, evidence_type: 'Clinical Note' },
      { id: 'p6c3', text: 'No significant cardiopulmonary disease that would contraindicate home study.', required: false, evidence_type: 'Sleep Study / PSG Report' },
    ],
  },
];

const today = new Date();
const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

export const MOCK_INITIAL_REQUESTS: { [key: string]: Omit<PreauthRequest, 'case_id'> } = {
  '27447': { // Knee - This will fail on criteria 1 ('conservative therapy for 6 weeks')
    payer: 'Aetna',
    cpt_code: '27447',
    patient_id: 'AET-12345',
    patient_dob: '1955-03-15',
    icd10_code: 'M17.11',
    provider_name: 'Dr. Emily Carter',
    provider_npi: '1234567890',
    facility: 'Outpatient',
    urgency: 'Routine',
    planned_date: nextWeek.toISOString().split('T')[0],
    clinical_justification: 'Patient has severe knee pain from osteoarthritis that significantly impacts ADLs. Patient desires surgical intervention and is medically cleared.',
    attachment_text: 'X-Ray Report: Confirms advanced joint disease (Kellgren-Lawrence grade 4).',
  },
  '27130': { // Hip - This will fail on criteria 2 ('3 months of non-operative management')
    payer: 'Blue Cross',
    cpt_code: '27130',
    patient_id: 'BC-98765',
    patient_dob: '1962-08-20',
    icd10_code: 'M16.12',
    provider_name: 'Dr. John Adams',
    provider_npi: '0987654321',
    facility: 'Inpatient',
    urgency: 'Routine',
    planned_date: nextWeek.toISOString().split('T')[0],
    clinical_justification: 'Patient presents with debilitating hip pain that limits all mobility and quality of life. Wants to proceed with surgery.',
    attachment_text: 'MRI Report: Findings consistent with advanced hip osteoarthritis.',
  },
  '92928': { // Stent - This should pass
    payer: 'Cigna',
    cpt_code: '92928',
    patient_id: 'CIG-55544',
    patient_dob: '1970-01-10',
    icd10_code: 'I25.10',
    provider_name: 'Dr. Maria Rodriguez',
    provider_npi: '1122334455',
    facility: 'Office',
    urgency: 'Expedited',
    planned_date: today.toISOString().split('T')[0],
    clinical_justification: 'Patient has ongoing stable angina despite optimal medical therapy.',
    attachment_text: 'Angiogram Report: 80% stenosis in LAD. Stress Test: Positive for myocardial ischemia.',
  },
  '93306': { // Echo - This should pass
    payer: 'UnitedHealthcare',
    cpt_code: '93306',
    patient_id: 'UHC-22334',
    patient_dob: '1948-11-05',
    icd10_code: 'I50.9',
    provider_name: 'Dr. David Chen',
    provider_npi: '6677889900',
    facility: 'Outpatient',
    urgency: 'Routine',
    planned_date: nextWeek.toISOString().split('T')[0],
    clinical_justification: 'Patient reports shortness of breath on exertion. Physical exam reveals a new murmur. Suspect heart failure. Evaluation of suspected heart failure and assessment of valvular heart disease are noted.',
    attachment_text: 'Clinical evaluation notes attached. Patient has signs consistent with valvular disease and potential for a known cardiac condition.',
  },
  '72148': { // MRI - This will fail on criteria 2 ('6 weeks of conservative care')
    payer: 'Humana',
    cpt_code: '72148',
    patient_id: 'HUM-77889',
    patient_dob: '1985-06-25',
    icd10_code: 'M54.5',
    provider_name: 'Dr. Sarah Miller',
    provider_npi: '3344556677',
    facility: 'ASC',
    urgency: 'Routine',
    planned_date: nextWeek.toISOString().split('T')[0],
    clinical_justification: 'Patient has radiating leg pain and numbness consistent with radiculopathy for the past 2 weeks. No red flags are present.',
    attachment_text: 'Neurological exam shows diminished reflexes.',
  },
  '95810': { // Sleep Study - This should pass
    payer: 'Anthem',
    cpt_code: '95810',
    patient_id: 'ANT-11223',
    patient_dob: '1978-09-30',
    icd10_code: 'G47.33',
    provider_name: 'Dr. Michael Lee',
    provider_npi: '9988776655',
    facility: 'Office',
    urgency: 'Routine',
    planned_date: nextWeek.toISOString().split('T')[0],
    clinical_justification: 'Patient reports excessive daytime sleepiness and partner has witnessed apneic episodes. Patient has loud snoring. High pre-test probability of moderate to severe OSA.',
    attachment_text: 'Epworth Sleepiness Scale: 18/24. STOP-BANG score: 6. No significant comorbidities noted in medical history.',
  }
};


export const MOCK_POLICY_SOURCES: PolicySource[] = [
    { id: 'ps-1', payer: 'Aetna', url: 'https://www.aetna.com/health-care-professionals/clinical-policy-bulletins.html' },
    { id: 'ps-2', payer: 'Blue Cross', url: 'https://www.bcbs.com/medical-policies' },
    { id: 'ps-3', payer: 'Cigna', url: 'https://www.cigna.com/health-care-providers/coverage-policies' },
    { id: 'ps-4', payer: 'UnitedHealthcare', url: 'https://www.uhcprovider.com/en/policies-protocols.html' },
];