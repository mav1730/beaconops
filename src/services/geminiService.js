// src/services/geminiService.js
require('dotenv').config(); // <-- explicitly load .env for isolated testing
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateFallbackPitch = (url, score) => {
  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    // ignore
  }
  return `Subject: Quick question regarding ${hostname} performance

Hi there,

I was checking out your website, ${hostname}, and ran a quick Google Lighthouse performance audit. 

Your performance score is ${score}/100, which suggests that visitors might be experiencing slow page loads. Google page speed is a significant factor in search rankings, and a lower score can directly affect your conversion rate.

I specialize in front-end performance tuning and backend optimization (specifically database indexing, server response times, and static asset delivery). 

Would you be open to a brief, 10-minute technical chat next week to discuss some quick wins to speed up your site?

Best regards,

Web Performance Consultant`;
};

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
    const fallbackPitch = generateFallbackPitch(url, score);
    console.warn(`[⚠️] Gemini API rate-limited/failed. Using mock fallback pitch.`);
    return fallbackPitch;
  }
};

module.exports = { generatePitch };

