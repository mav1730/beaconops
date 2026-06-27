// src/services/geminiService.js
require('dotenv').config(); // <-- explicitly load .env for isolated testing
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateFallbackPitch = (url, score, seoScore) => {
  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    // ignore
  }
  return `Subject: Quick question regarding ${hostname} performance & SEO

Hi there,

I was checking out your website, ${hostname}, and ran a quick Google Lighthouse performance and SEO audit. 

Your performance score is ${score}/100 and your SEO score is ${seoScore}/100. A lower speed and SEO score directly affect your organic visibility and search rankings on Google, which can bleed potential conversion revenue.

I specialize in front-end performance tuning, backend optimization (specifically database indexing, TTFB), and technical SEO alignment.

Would you be open to a brief, 10-minute technical chat next week to discuss some quick wins to speed up your site and boost your SEO?

Best regards,

Web Performance Consultant`;
};

const generatePitch = async (url, score, seoScore) => {
  console.log(`[🧠] Generating AI pitch for ${url} (Performance: ${score}, SEO: ${seoScore})...`);

  const prompt = `Act as a senior web performance consultant. Write a short, non-spammy cold email to the founder of ${url}. 
  Explain exactly how their Google Lighthouse performance score of ${score}/100 and SEO score of ${seoScore}/100 are actively hurting their search rankings and bleeding their conversion rates. 
  Offer a 10-minute technical chat to fix their backend architecture, asset delivery, and SEO structure. 
  Keep it under 150 words. Be direct, technical, and professional. Do not use generic buzzwords.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || (response.candidates && response.candidates[0]?.content?.parts[0]?.text);
    if (!text) {
      throw new Error("Empty response received from Gemini API.");
    }

    console.log(`[✅] Pitch successfully generated.`);
    return text;
  } catch (error) {
    console.error(`[❌] Gemini API Error:`, error.message);
    const fallbackPitch = generateFallbackPitch(url, score, seoScore);
    console.warn(`[⚠️] Gemini API rate-limited/failed. Using mock fallback pitch.`);
    return fallbackPitch;
  }
};

module.exports = { generatePitch };
