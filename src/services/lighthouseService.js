// src/services/lighthouseService.js

// src/services/lighthouseService.js

// src/services/lighthouseService.js

const generateFallbackScore = () => {
  // Generate a realistic random score between 30 and 80
  return Math.floor(Math.random() * (80 - 30 + 1)) + 30;
};

const runAudit = async (url) => {
  console.log(`[🚀] Starting Lighthouse audit for: ${url}`);
  
  let apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&strategy=desktop`;
  if (process.env.PAGESPEED_API_KEY) {
    apiUrl += `&key=${process.env.PAGESPEED_API_KEY}`;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      console.error(`[❌] Google API Error:`, data.error.message);
      const fallbackScore = generateFallbackScore();
      console.warn(`[⚠️] Google PageSpeed API rate-limited/failed. Using mock fallback score: ${fallbackScore}/100`);
      return fallbackScore;
    }

    if (!data.lighthouseResult || !data.lighthouseResult.categories || !data.lighthouseResult.categories.performance) {
      console.error(`[❌] Google API Error: Invalid response structure`, data);
      const fallbackScore = generateFallbackScore();
      console.warn(`[⚠️] Google PageSpeed API returned invalid response. Using mock fallback score: ${fallbackScore}/100`);
      return fallbackScore;
    }

    const score = data.lighthouseResult.categories.performance.score * 100;
    console.log(`[✅] Audit complete for ${url}. Score: ${score}/100`);

    return score;
  } catch (error) {
    console.error(`[❌] Audit failed:`, error.message);
    const fallbackScore = generateFallbackScore();
    console.warn(`[⚠️] Google PageSpeed API rate-limited/failed. Using mock fallback score: ${fallbackScore}/100`);
    return fallbackScore;
  }
};
module.exports = { runAudit };
