
import { GoogleGenAI, Type } from "@google/genai";
import { Regulator } from "../types";

/**
 * Robustly extracts a JSON array from a string that might contain other text or markdown.
 */
const extractJsonArray = (text: string): any[] => {
  try {
    // Try to find the first '[' and last ']'
    const startIdx = text.indexOf('[');
    const endIdx = text.lastIndexOf(']');
    
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const potentialJson = text.substring(startIdx, endIdx + 1);
      return JSON.parse(potentialJson);
    }
    
    // Fallback: try parsing directly
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from model response:", e, text);
    return [];
  }
};

/**
 * Fetches the latest regulatory updates using Google Search grounding.
 * Uses gemini-3-pro-preview as required for search grounding tools.
 */
export const fetchLatestUpdates = async (regulators: Regulator[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview'; 
  
  // Broadening the scope to ensure we find something, focusing on template/communication impact
  const prompt = `
    Search the official websites and news releases of the following Canadian regulators: ${regulators.join(', ')}.
    Find the 5 most recent (last 90 days) significant updates, guidance notes, or notices of amendment.
    
    Specifically look for updates that impact:
    1. Customer communication standards
    2. Document template requirements (e.g. font sizes, mandatory wording)
    3. Disclosure requirements for banking or insurance products
    
    Our customer "Moto" is a major Canadian financial services provider. Identify updates with high impact for them.

    Output the findings ONLY as a JSON array of objects with this structure:
    [{
      "id": "unique_id",
      "regulator": "Name of Regulator",
      "date": "YYYY-MM-DD",
      "title": "Clear concise title",
      "summary": "1-2 sentence impact summary",
      "url": "Direct link to the announcement",
      "impactLevel": "High" | "Medium" | "Low"
    }]
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: With googleSearch, the model sometimes ignores responseMimeType
        // so we handle the text extraction manually for stability.
      }
    });

    const text = response.text || '';
    return extractJsonArray(text);
  } catch (error) {
    console.error("Error in Gemini Search Service:", error);
    return [];
  }
};

/**
 * Analyzes a document template for compliance against a summary of recent updates.
 */
export const analyzeTemplate = async (templateText: string, recentUpdates: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const prompt = `
    You are a Canadian Regulatory Compliance Specialist for "Moto Financial". 
    
    Analyze the following document template content against these recent regulatory updates:
    UPDATES: ${recentUpdates}
    
    TEMPLATE CONTENT:
    """
    ${templateText}
    """
    
    TASK:
    1. Determine if the template needs changes to remain compliant.
    2. Check for required legal headers, specific font mentions, or mandatory disclosure clauses.
    
    Return a JSON object:
    {
      "status": "Compliant" | "At Risk" | "Needs Review",
      "summary": "Detailed compliance reasoning",
      "suggestedChanges": ["Actionable step 1", "Actionable step 2"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            summary: { type: Type.STRING },
            suggestedChanges: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["status", "summary", "suggestedChanges"]
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in Template Analysis Service:", error);
    return null;
  }
};
