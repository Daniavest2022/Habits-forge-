
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationalQuote = async (habitName: string, streak: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Give me a short, powerful, 1-sentence motivational quote for someone building a habit of "${habitName}". They currently have a ${streak}-day streak. Keep it under 15 words.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text || "Your future self will thank you for today's effort.";
  } catch (error) {
    return "Consistency is the key to transformation.";
  }
};

export const getCoachAdvice = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are a world-class behavioral psychologist and habit coach. 
      Analyze this user's habit data: ${JSON.stringify(data)}.
      Provide a concise summary (3 points) of:
      1. Their current strength.
      2. A potential friction point you notice in their patterns.
      3. One specific "atomic habit" trick to help them hit their 21-day goal.
      Format the response as clear, encouraging bullet points.`,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    return response.text || "Keep pushing forward! Your patterns look promising.";
  } catch (error) {
    return "Keep focusing on small wins today.";
  }
};
