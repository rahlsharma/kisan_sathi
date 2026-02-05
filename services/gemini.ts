
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// The API key is obtained from process.env.API_KEY
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
    const prompt = `Search for the latest active government agricultural schemes, subsidies, and insurance for a farmer in ${location} growing ${crops.join(', ')}. Provide a list with the name of the scheme, a brief description, and the official website URL. Respond in ${language}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title,
        url: chunk.web?.uri
      })).filter((s: any) => s.url) || []
    };
  } catch (error) {
    console.error("Schemes Fetch Error:", error);
    return { text: "Failed to fetch schemes.", sources: [] };
  }
};
