import {
  PreauthRequest,
  PreauthDecision,
  CaseHistory,
  ValidationChecklistEntry,
  Policy,
  PolicyChecklist,
  ValidationCriterion,
  AiAssistData,
  AiAssistRequest,
} from "../types";
import { MOCK_POLICIES, MOCK_CHECKLISTS } from "./mockData";
import {
  generateAiJustification,
  JustificationResponse,
  generateAiAssistTips,
} from "./geminiService";

let caseHistory: CaseHistory = {};
let submissionLog: Array<{
  caseId: string;
  timestamp: Date;
  status: string;
  payer: string;
}> = [];
let checklists = JSON.parse(
  JSON.stringify(MOCK_CHECKLISTS)
) as PolicyChecklist[];

const findPolicy = (payer: string, cpt: string) => {
  return MOCK_POLICIES.find((p) => p.payer === payer && p.cpt_code === cpt);
};

const findChecklist = (policyId: string) => {
  return checklists.find((c) => c.policyId === policyId);
};

// Enhanced keyword-based logic with confidence scoring for realistic demo
const checkCriteria = (
  justification: string,
  attachmentText: string,
  checklist: PolicyChecklist
): {
  met: string[];
  unmet: string[];
  validation_checklist: ValidationChecklistEntry[];
} => {
  const met: string[] = [];
  const unmet: string[] = [];
  const validation_checklist: ValidationChecklistEntry[] = [];

  // Enhanced keyword mapping with primary and secondary keywords
  const keywordsMap: {
    [key: string]: { primary: string[]; secondary: string[] };
  } = {
    p1c1: {
      primary: ["6 weeks", "six weeks", "physical therapy"],
      secondary: ["conservative", "pt", "therapy", "treatment", "failed"],
    },
    p1c2: {
      primary: ["kl grade", "kellgren", "grade 4", "grade 3"],
      secondary: [
        "radiographic",
        "x-ray",
        "imaging",
        "advanced",
        "joint disease",
      ],
    },
    p1c3: {
      primary: ["adls", "activities of daily living", "functional disability"],
      secondary: ["impacts", "limits", "pain", "mobility"],
    },
    p1c4: {
      primary: ["medically cleared", "cleared for surgery"],
      secondary: ["clearance", "medical", "surgery"],
    },
    p2c2: {
      primary: ["3 months", "three months"],
      secondary: ["non-operative", "conservative", "management", "failure"],
    },
    p5c2: {
      primary: ["6 weeks", "six weeks", "persist"],
      secondary: ["conservative", "symptoms", "care"],
    },
  };

  checklist.criteria.forEach((criterion: ValidationCriterion) => {
    let sourceText = "";
    let evidenceSourceNote = "";

    switch (criterion.evidence_type) {
      case "Clinical Note":
      case "Other Documentation":
      case "Lab Results":
        sourceText = justification.toLowerCase();
        evidenceSourceNote = "in clinical justification";
        break;
      case "MRI / Imaging":
      case "Stress Test / Cardiac Evidence":
      case "Sleep Study / PSG Report":
        sourceText = attachmentText.toLowerCase();
        evidenceSourceNote = "in attachment";
        break;
    }

    // Calculate confidence score
    let confidenceScore = 0;
    const keywordConfig = keywordsMap[criterion.id];

    if (keywordConfig) {
      // Primary keywords worth more (0.6 points each, max 1.0)
      const primaryMatches = keywordConfig.primary.filter((kw) =>
        sourceText.includes(kw)
      ).length;
      confidenceScore += Math.min(primaryMatches * 0.6, 1.0);

      // Secondary keywords add partial credit (0.15 points each, max 0.4)
      const secondaryMatches = keywordConfig.secondary.filter((kw) =>
        sourceText.includes(kw)
      ).length;
      confidenceScore += Math.min(secondaryMatches * 0.15, 0.4);
    } else {
      // Fallback: use criterion text keywords
      const fallbackKeywords = criterion.text
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 4);
      const matches = fallbackKeywords.filter((kw) =>
        sourceText.includes(kw)
      ).length;
      confidenceScore = Math.min(matches * 0.3, 1.0);
    }

    // Add slight randomization for demo realism (±10%)
    const randomFactor = 0.9 + Math.random() * 0.2;
    confidenceScore = Math.min(confidenceScore * randomFactor, 1.0);

    // Determine if criterion is met based on confidence threshold
    const CONFIDENCE_THRESHOLD = criterion.required ? 0.5 : 0.3;
    const evidenceFound = confidenceScore >= CONFIDENCE_THRESHOLD;
    const isMet = evidenceFound || !criterion.required;

    if (isMet) {
      met.push(criterion.text);
      const strengthLabel =
        confidenceScore > 0.8
          ? "Strong"
          : confidenceScore > 0.5
          ? "Adequate"
          : "Partial";
      validation_checklist.push({
        criterion: criterion.text,
        status: "met",
        evidence_notes: evidenceFound
          ? `${strengthLabel} supporting documentation found ${evidenceSourceNote}.`
          : `Criterion not required.`,
      });
    } else {
      unmet.push(criterion.text);
      const suggestionLabel =
        confidenceScore > 0.3
          ? "Incomplete documentation"
          : "Missing documentation";
      validation_checklist.push({
        criterion: criterion.text,
        status: "unmet",
        evidence_notes: `${suggestionLabel} ${evidenceSourceNote}. Please provide specific details.`,
      });
    }
  });

  return { met, unmet, validation_checklist };
};

export const validatePreauth = async (
  request: PreauthRequest
): Promise<PreauthDecision> => {
  const policy = findPolicy(request.payer, request.cpt_code);
  if (!policy) throw new Error("Policy not found");

  const checklist = findChecklist(policy.id);
  if (!checklist) throw new Error("Checklist not found");

  const { met, unmet, validation_checklist } = checkCriteria(
    request.clinical_justification,
    request.attachment_text,
    checklist
  );

  // Calculate base approval score
  let approval_probability_score = Math.round(
    (met.length / (met.length + unmet.length)) * 100
  );

  // Add realistic variance for demo purposes (±5-10 points based on content quality)
  const contentLength =
    request.clinical_justification.length + request.attachment_text.length;
  const contentQualityBonus = Math.min(Math.floor(contentLength / 200), 10); // Up to 10 bonus points for detailed submissions
  const randomVariance = Math.floor(Math.random() * 6) - 3; // -3 to +3 random variance

  approval_probability_score = Math.max(
    0,
    Math.min(
      100,
      approval_probability_score + contentQualityBonus + randomVariance
    )
  );

  // Determine decision based on score
  let decision: PreauthDecision["decision"] = "Needs Review";
  if (approval_probability_score >= 95) {
    decision = "Approved";
  } else if (approval_probability_score < 70) {
    decision = "Denied";
  }

  let aiResponse: JustificationResponse = {
    new_justification: "All criteria met.",
    new_attachment_text: "All supporting documentation present.",
    recommended_actions: [],
  };

  if (unmet.length > 0) {
    aiResponse = await generateAiJustification(unmet, policy.name, request);
  }

  const caseId = request.case_id || `CASE-${Date.now()}`;

  const result: PreauthDecision = {
    case_id: caseId,
    decision,
    approval_probability_score,
    policy_name: policy.name,
    criteria_met: met,
    criteria_unmet: unmet,
    validation_checklist,
    ai_improved_justification: aiResponse.new_justification,
    ai_improved_attachment_text: aiResponse.new_attachment_text,
    recommended_actions: aiResponse.recommended_actions,
    can_resubmit_without_new_case: true,
    original_request: request,
  };

  if (!caseHistory[caseId]) {
    caseHistory[caseId] = [];
  }
  caseHistory[caseId].push(result);

  return result;
};

export const getPolicies = (): Promise<Policy[]> => {
  return Promise.resolve(MOCK_POLICIES);
};

export const getPolicyChecklist = (
  policyId: string
): Promise<PolicyChecklist | undefined> => {
  return Promise.resolve(checklists.find((c) => c.policyId === policyId));
};

export const updateChecklist = (
  policyId: string,
  updatedCriteria: any[]
): Promise<PolicyChecklist> => {
  const checklistIndex = checklists.findIndex((c) => c.policyId === policyId);
  if (checklistIndex === -1) {
    throw new Error("Checklist not found");
  }
  checklists[checklistIndex].criteria = updatedCriteria;
  return Promise.resolve(checklists[checklistIndex]);
};

export const getCaseHistory = (): Promise<CaseHistory> => {
  return Promise.resolve(caseHistory);
};

export const generateTips = async (
  request: Omit<PreauthRequest, "case_id" | "case_id">
): Promise<AiAssistData | null> => {
  const policy = findPolicy(request.payer, request.cpt_code);
  if (!policy) return null;

  const checklist = findChecklist(policy.id);
  if (!checklist) return null;

  const assistRequest: AiAssistRequest = {
    payer: request.payer,
    cpt_code: request.cpt_code,
    icd10_code: request.icd10_code,
    clinical_justification: request.clinical_justification,
    attachment_text: request.attachment_text,
    policy_criteria: checklist.criteria,
  };

  return generateAiAssistTips(assistRequest);
};

export const submitPreauthorization = async (
  decision: PreauthDecision
): Promise<void> => {
  // Simulate submission delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Log the submission
  submissionLog.push({
    caseId: decision.case_id,
    timestamp: new Date(),
    status: "Submitted to Payer",
    payer: decision.original_request.payer,
  });

  // Update case history with submission status
  if (caseHistory[decision.case_id]) {
    const lastEntry =
      caseHistory[decision.case_id][caseHistory[decision.case_id].length - 1];
    // Mark as submitted (in a real app, this would update the decision object)
    console.log(
      `Preauthorization ${decision.case_id} submitted to ${decision.original_request.payer}`
    );
  }
};

export const getSubmissionLog = () => {
  return submissionLog;
};
