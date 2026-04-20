
import Groq from "groq-sdk";
import { PreauthRequest, AiAssistData, AiAssistRequest } from "../types";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn("GROQ_API_KEY environment variable not set. AI calls will fail.");
}

const groq = new Groq({
  apiKey: GROQ_API_KEY!,
  dangerouslyAllowBrowser: true, // required for client-side Vite apps
});

// Model to use — update here if needed
const GROQ_MODEL = "llama-3.3-70b-versatile";

export interface JustificationResponse {
  new_justification: string;
  new_attachment_text: string;
  recommended_actions: string[];
}

export const generateAiJustification = async (
  unmetCriteria: string[],
  policyName: string,
  originalRequest: PreauthRequest
): Promise<JustificationResponse> => {
  if (!GROQ_API_KEY) {
    return {
      new_justification: `API Key not configured. Patient presents with symptoms requiring procedure CPT ${originalRequest.cpt_code}. Clinical information has been reviewed to align with ${policyName} requirements.`,
      new_attachment_text: `Placeholder supporting evidence. Documentation of unmet criteria should be included here.`,
      recommended_actions: ["Provide documentation for Criterion A.", "Clarify details for Criterion B."],
    };
  }

  const prompt = `
You are an expert Utilization Management (UM) nurse. A preauthorization request for CPT code ${originalRequest.cpt_code} under the '${policyName}' policy failed to meet all criteria.

Original Clinical Justification:
"${originalRequest.clinical_justification}"

Original Supporting Evidence:
"${originalRequest.attachment_text}"

Criteria NOT MET:
${unmetCriteria.map((c) => `- ${c}`).join("\n")}

Return ONLY a valid JSON object with these exact keys:
{
  "new_justification": "A completely rewritten professional UM nurse justification. Structure: Patient presents with... Relevant clinical findings include... Supporting evidence indicates... These findings support medical necessity for CPT ${originalRequest.cpt_code} under ${originalRequest.payer} policy. Do NOT mention denial or resubmission.",
  "new_attachment_text": "Rewritten supporting clinical evidence summary, inferring specific details needed to meet unmet criteria.",
  "recommended_actions": ["Actionable step 1 for provider", "Actionable step 2 for provider"]
}`;

  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const parsed: JustificationResponse = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return {
      new_justification:
        "An error occurred while generating the AI justification. Please try again.",
      new_attachment_text:
        "An error occurred. Please review policy requirements for supporting documentation.",
      recommended_actions: [
        "Review the medical policy criteria and resubmit with additional documentation.",
        "Contact support if the issue persists.",
      ],
    };
  }
};

export const generateAiAssistTips = async (
  request: AiAssistRequest
): Promise<AiAssistData> => {
  if (!GROQ_API_KEY) {
    return {
      recommended_evidence: [
        "Physical Therapy progress notes confirming ≥ 6 weeks of conservative treatment.",
        "X-ray or MRI confirming KL Grade 3–4 osteoarthritis.",
        "Pain score documentation and impact on Activities of Daily Living (ADLs).",
        "[AI Suggestion] Consider attaching a letter from the patient describing daily activity limitations.",
      ],
      evidence_explanation:
        "These documents demonstrate medical necessity and increase approval likelihood.",
      recommended_phrases_to_insert: [
        "Patient presents with symptoms consistent with...",
        "Conservative treatment options have been exhausted.",
        "Medical necessity is supported by...",
      ],
      contextual_coaching:
        "Clearly link the patient's symptoms and failed conservative treatments to the specific policy criteria.",
    };
  }

  const prompt = `
You are an expert Utilization Management (UM) nurse providing real-time guidance on a preauthorization form. Generate concise, actionable, positive tips.

CONTEXT:
- Payer: ${request.payer}
- CPT Code: ${request.cpt_code}
- ICD-10 Code: ${request.icd10_code}

USER INPUT:
- Clinical Justification: "${request.clinical_justification}"
- Supporting Evidence: "${request.attachment_text}"

POLICY CRITERIA THAT MUST BE MET:
${request.policy_criteria.map((c) => `- ${c.text} (${c.required ? "Required" : "Optional"}, Evidence: ${c.evidence_type})`).join("\n")}

Return ONLY a valid JSON object with these exact keys:
{
  "recommended_evidence": ["Specific missing document 1", "Specific missing document 2", "[AI Suggestion] One creative context-aware suggestion based on the user's justification"],
  "evidence_explanation": "A short friendly explanation of why this evidence matters.",
  "recommended_phrases_to_insert": ["Professional UM phrase 1", "Professional UM phrase 2", "Professional UM phrase 3"],
  "contextual_coaching": "1-3 sentences of high-level advice to improve approval chances."
}`;

  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const parsed: AiAssistData = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error("Error calling Groq API for AI Assist:", error);
    return {
      recommended_evidence: ["AI assist is currently unavailable."],
      evidence_explanation: "Could not retrieve tips at this time.",
      recommended_phrases_to_insert: [],
      contextual_coaching:
        "An error occurred while generating tips. Please check your connection and try again.",
    };
  }
};
