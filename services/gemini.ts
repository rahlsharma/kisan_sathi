
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

const API_KEY = process.env.API_KEY || '';

export const getGeminiResponse = async (prompt: string, language: Language) => {
  if (!API_KEY) return "API Key is missing. Please check your environment.";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `You are KisanSathi, an expert agricultural assistant. Provide helpful, accurate, and practical farming advice in ${language}. Keep responses concise and use a friendly, encouraging tone suitable for a farmer.`,
      temperature: 0.7,
    },
  });

  return response.text || "I'm sorry, I couldn't generate a response.";
};

export const analyzeCropImage = async (base64Image: string, language: Language) => {
  if (!API_KEY) return { diagnosis: "API Key missing", treatment: "N/A" };

  const ai = new GoogleGenAI({ apiKey: API_KEY });
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
          text: `Identify any disease or nutrient deficiency in this plant leaf. Provide the diagnosis and a detailed treatment plan including organic and chemical options. Respond in ${language} using a structured JSON format with keys "diagnosis" and "treatment".`,
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

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { diagnosis: "Could not analyze image.", treatment: "Please try again with a clearer photo." };
  }
};

export const getMarketUpdates = async (location: string, language: Language) => {
   const ai = new GoogleGenAI({ apiKey: API_KEY });
   const response = await ai.models.generateContent({
     model: "gemini-3-pro-preview",
     contents: `Find the current mandi prices and market trends for major crops in ${location}. List them for a farmer in ${language}.`,
     config: {
       tools: [{googleSearch: {}}],
     },
   });
   return response.text;
};
