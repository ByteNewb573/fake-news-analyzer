import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  status: "Real" | "Fake" | "Misleading" | "Unverified";
  credibilityScore: number;
  explanation: string;
}

export async function analyzeNews(text: string, isUrl: boolean = false): Promise<AnalysisResult> {
  try {
    const model = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: isUrl ? `Analyze the news at this URL: ${text}` : text }] }],
      config: {
        tools: isUrl ? [{ urlContext: {} }] : [],
        systemInstruction: `You are a professional fact-checker. Analyze the provided news ${isUrl ? 'URL' : 'text'}. 
        Return a JSON object with:
        - status: "Real", "Fake", "Misleading", or "Unverified"
        - credibilityScore: 0-100 (100 being most credible)
        - explanation: A concise explanation of why you reached this conclusion, citing potential red flags or confirming facts.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["Real", "Fake", "Misleading", "Unverified"] },
            credibilityScore: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["status", "credibilityScore", "explanation"]
        }
      }
    });

    const response = await model;
    if (!response.text) {
      throw new Error("Empty response from AI");
    }
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("The AI was unable to generate a result. Please check your API key or try again later.");
  }
}
