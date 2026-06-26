// src/services/geminiService.js
require('dotenv').config(); // <-- explicitly load .env for isolated testing
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generatePitch = async (url, score) => {
  console.log(`[🧠] Generating AI pitch for ${url} (Score: ${score})...`);

  const prompt = `Act as a senior web performance consultant. Write a short, non-spammy cold email to the founder of ${url}. 
  Explain exactly how their Google Lighthouse performance score of ${score}/100 is actively hurting their SEO and bleeding their conversion rates. 
  Offer a 10-minute technical chat to fix their backend architecture and asset delivery. 
  Keep it under 150 words. Be direct, technical, and professional. Do not use generic buzzwords.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    console.log(`[✅] Pitch successfully generated.`);
    return response.text;
  } catch (error) {
    console.error(`[❌] Gemini API Error:`, error.message);
    return null;
  }
};

module.exports = { generatePitch };

