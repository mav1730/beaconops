// src/services/lighthouseService.js

// src/services/lighthouseService.js

// src/services/lighthouseService.js

const runAudit = async (url) => {
  console.log(`[🚀] Starting Lighthouse audit for: ${url}`);
  
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&category=performance&strategy=desktop`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      console.error(`[❌] Google API Error:`, data.error.message);
      return null;
    }

    const score = data.lighthouseResult.categories.performance.score * 100;
    console.log(`[✅] Audit complete for ${url}. Score: ${score}/100`);

    return score;
  } catch (error) {
    console.error(`[❌] Audit failed:`, error.message);
    return null;
  }
};
module.exports = { runAudit };
