
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (prompt: string, language: Language) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are KisanSathi, an expert agricultural assistant. Provide helpful, accurate, and practical farming advice in ${language}. Keep responses concise and use a friendly, encouraging tone suitable for a farmer.`,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};

export const analyzeCropImage = async (base64Image: string, language: Language) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: `Act as a senior plant pathologist. Identify any disease, pest infestation (check for Whiteflies, Aphids, Stem Borers), or nutrient deficiency in this leaf. 
            Provide the diagnosis and a detailed treatment plan. 
            Include:
            1. Organic/Natural remedies.
            2. Specific chemical treatments if necessary.
            3. Prevention tips.
            Respond in ${language} using a structured JSON format with keys "diagnosis" and "treatment". Ensure the "treatment" value uses clear bullet points.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            treatment: { type: Type.STRING },
          },
          required: ["diagnosis", "treatment"],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { diagnosis: "Could not analyze image.", treatment: "Please try again with a clearer photo." };
  }
};

export const getMarketUpdates = async (query: string, location: string, language: Language) => {
   const ai = getAIClient();
   try {
     const prompt = `Find current mandi prices and market trends for "${query}" in and around ${location}. Provide a summary for a farmer in ${language}.`;
     const response = await ai.models.generateContent({
       model: "gemini-3-pro-preview",
       contents: prompt,
       config: {
         tools: [{googleSearch: {}}],
       },
     });
     
     let text = response.text || "";
     const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
     if (chunks && chunks.length > 0) {
       text += "\n\nSources:\n" + chunks.map((c: any) => c.web?.uri).filter(Boolean).join("\n");
     }
     return text;
   } catch (error) {
     return "Unable to fetch real-time market data for your query.";
   }
};

export const getGovernmentSchemes = async (location: string, crops: string[], language: Language) => {
  const ai = getAIClient();
  try {
    const prompt = `Search for the latest active Central Government of India agricultural schemes (such as PM-Kisan, PM Fasal Bima Yojana - PMFBY, e-NAM, Pradhan Mantri Krishi Sinchai Yojana - PMKSY, Soil Health Card Scheme, and National Mission for Sustainable Agriculture) along with relevant state-specific benefits for a farmer in ${location} growing ${crops.join(', ')}. 

    IMPORTANT: ALWAYS prioritize and list the major Central Government schemes first as they are the most beneficial for farmers nationwide. 

    Return the response in ${language} as a JSON object with a 'summary' string (briefly explaining why these schemes are the best for the user) and a 'schemes' array.
    Each scheme object MUST have: 'name', 'description', 'category' (Must be one of: "Subsidy", "Loan", "Insurance", "Training", "Other"), 'url', 'eligibility' (string array), and 'steps' (string array).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            schemes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  url: { type: Type.STRING },
                  eligibility: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["name", "description", "category", "url", "eligibility", "steps"]
              }
            }
          },
          required: ["summary", "schemes"]
        }
      },
    });

    const parsed = JSON.parse(response.text || '{"summary": "", "schemes": []}');
    return {
      text: parsed.summary,
      schemes: parsed.schemes
    };
  } catch (error) {
    console.error("Schemes Fetch Error:", error);
    return { text: "Failed to fetch schemes.", schemes: [] };
  }
};
