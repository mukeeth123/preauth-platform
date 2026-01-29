
import { GoogleGenAI, Type } from "@google/genai";
import { PreauthRequest, AiAssistData, AiAssistRequest } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export interface JustificationResponse {
  new_justification: string;
  new_attachment_text: string;
  recommended_actions: string[];
}

export const generateAiJustification = async (unmetCriteria: string[], policyName: string, originalRequest: PreauthRequest): Promise<JustificationResponse> => {
  if (!API_KEY) {
    return {
      new_justification: `API Key not configured. This is a placeholder justification. Patient presents with symptoms requiring procedure CPT ${originalRequest.cpt_code}. The provided clinical information and supporting evidence have been reviewed and updated to better align with ${policyName} requirements. These findings support medical necessity.`,
      new_attachment_text: `Placeholder supporting evidence. Documentation of unmet criteria (e.g., conservative therapy duration, specific test results) should be included here.`,
      recommended_actions: ["Provide documentation for Criterion A.", "Clarify details for Criterion B."]
    };
  }

  const prompt = `
    A preauthorization request for CPT code ${originalRequest.cpt_code} under the '${policyName}' policy was submitted but failed to meet all criteria.
    Your task is to act as an expert Utilization Management (UM) nurse and rewrite the clinical submission to meet the criteria.

    Original Clinical Justification:
    "${originalRequest.clinical_justification}"

    Original Supporting Evidence:
    "${originalRequest.attachment_text}"

    The following criteria were NOT MET:
    ${unmetCriteria.map(c => `- ${c}`).join('\n')}

    Based on the unmet criteria, provide the following in JSON format:
    1.  "new_justification": A completely rewritten, clean clinical justification in a professional UM nurse tone. Synthesize information from the original justification and infer what is needed to meet the criteria. The new note should be structured logically: "Patient presents with... Relevant clinical findings include... Supporting evidence indicates... These findings support medical necessity for CPT ${originalRequest.cpt_code} under ${originalRequest.payer} policy." DO NOT mention the denial or resubmission. Write it as if it's a perfect initial submission.
    2.  "new_attachment_text": A rewritten summary of the supporting clinical evidence. Infer the specific details needed to meet the unmet criteria (e.g., if "6 weeks of conservative therapy" was missing, add a sentence like "Conservative care log confirms 8 weeks of physical therapy with minimal improvement.").
    3.  "recommended_actions": A list of clear, actionable steps for the provider to *actually* find and add the missing documentation. For example: "Locate and attach the physical therapy notes detailing the 6+ weeks of conservative treatment."
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            new_justification: {
              type: Type.STRING,
              description: "The completely rewritten clinical justification in a professional UM nurse tone."
            },
            new_attachment_text: {
                type: Type.STRING,
                description: "The rewritten summary of supporting clinical evidence, including inferred details to meet criteria."
            },
            recommended_actions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A list of actionable steps for the provider."
              },
            }
          },
          required: ["new_justification", "new_attachment_text", "recommended_actions"]
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedResponse: JustificationResponse = JSON.parse(jsonText);
    return parsedResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      new_justification: "An error occurred while generating the AI justification. The clinical information provided does not meet the requirements of the medical policy.",
      new_attachment_text: "An error occurred. Please review policy requirements for supporting documentation.",
      recommended_actions: ["Review the medical policy criteria and resubmit with additional documentation.", "Contact support if the issue persists."],
    };
  }
};

export const generateAiAssistTips = async (request: AiAssistRequest): Promise<AiAssistData> => {
  if (!API_KEY) {
    // Return mock data if no API key
    return {
      recommended_evidence: [
        "Physical Therapy progress notes confirming ≥ 6 weeks of conservative treatment.",
        "X-ray or MRI confirming KL Grade 3–4 osteoarthritis.",
        "Pain score documentation and impact on Activities of Daily Living (ADLs).",
        "[AI Suggestion] Consider attaching a letter from the patient describing how their condition limits specific daily activities, adding a personal and compelling element to the case."
      ],
      evidence_explanation: "These documents help demonstrate medical necessity and increase approval likelihood by directly addressing the payer's policy requirements.",
      recommended_phrases_to_insert: ["Patient presents with symptoms consistent with...", "Conservative treatment options have been exhausted.", "Medical necessity is supported by..."],
      contextual_coaching: "To improve approval odds, clearly link the patient's symptoms and failed conservative treatments to the specific policy criteria for this CPT code."
    };
  }

  const prompt = `
    You are an expert Utilization Management (UM) nurse providing real-time, helpful reminders on a preauthorization request form. Your goal is to guide the user to a successful submission by suggesting what evidence is needed.
    Analyze the provided clinical information against the payer's policy criteria and generate concise, actionable tips. Frame your advice positively, as helpful suggestions, not as errors or warnings.

    CONTEXT:
    - Payer: ${request.payer}
    - CPT Code: ${request.cpt_code}
    - ICD-10 Code: ${request.icd10_code}

    USER'S CURRENT INPUT:
    - Clinical Justification draft: "${request.clinical_justification}"
    - Supporting Evidence draft (extracted text from documents): "${request.attachment_text}"

    PAYER POLICY CRITERIA THAT MUST BE MET:
    ${request.policy_criteria.map(c => `- ${c.text} (${c.required ? 'Required' : 'Optional'}, Evidence: ${c.evidence_type})`).join('\n')}

    YOUR TASK:
    Based on the user's input and the policy, provide a JSON object with the following keys. Focus only on criteria that appear to be missing or weakly supported.
    1. "recommended_evidence": An array of strings. For each key piece of missing evidence, create a bullet point describing the document or finding needed. Be specific. Examples: "Physical Therapy notes confirming at least 6 weeks of treatment.", "Recent MRI report indicating advanced joint disease (KL grade 3-4).". In addition to the standard policy criteria, add ONE creative, context-aware suggestion for supporting evidence that might strengthen the case, based on the specific details in the user's justification. Prefix this special suggestion with "[AI Suggestion]".
    2. "evidence_explanation": A single, short, friendly string explaining why providing this evidence is important. Example: "Including these details clearly demonstrates that the patient meets the medical necessity criteria, which can speed up the approval process."
    3. "recommended_phrases_to_insert": An array of 3-4 short, professional, UM-nurse style phrases the user could insert into their justification to strengthen it. Examples: "Patient has failed conservative therapy including...", "Imaging results confirm...", "This procedure is medically necessary because...".
    4. "contextual_coaching": A single string (1-3 sentences) giving the user high-level advice on how to improve their submission's chance of approval. Example: "Focus on clearly documenting the failure of conservative treatments. Ensure the attached X-ray report explicitly mentions Kellgren-Lawrence grade 3 or 4."
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommended_evidence: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of specific documents or findings needed, including one creative AI suggestion."
            },
            evidence_explanation: {
              type: Type.STRING,
              description: "A friendly explanation of why the recommended evidence is important."
            },
            recommended_phrases_to_insert: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Short, professional phrases to strengthen the justification."
            },
            contextual_coaching: {
              type: Type.STRING,
              description: "High-level advice to improve the submission."
            }
          },
          required: ["recommended_evidence", "evidence_explanation", "recommended_phrases_to_insert", "contextual_coaching"]
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedResponse: AiAssistData = JSON.parse(jsonText);
    return parsedResponse;

  } catch (error) {
    console.error("Error calling Gemini API for AI Assist:", error);
    return {
      recommended_evidence: ["AI assist is currently unavailable."],
      evidence_explanation: "Could not retrieve tips at this time.",
      recommended_phrases_to_insert: [],
      contextual_coaching: "An error occurred while generating tips. Please check your connection and try again."
    };
  }
};
