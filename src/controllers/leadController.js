const prisma = require('../config/db');

// Import the engines
const { auditWebsite } = require('../services/lighthouseService');
const { generatePitch } = require('../services/geminiService');

const createLead = async (req, res) => {
  const { url } = req.body;
  try {
    // 1. Run the Audit (gets performance and seo scores)
    const { performance, seo } = await auditWebsite(url);

    // 2. Generate Pitch (If performance score succeeded)
    let pitch = null;
    if (performance !== null) {
      pitch = await generatePitch(url, performance, seo);
    }

    // 3. Save everything to the database
    const lead = await prisma.lead.create({
      data: {
        url,
        score: performance, // map performance to score field
        seo: seo,           // map seo to new seo field
        pitch
      }
    });

    // 4. Return the full package back to n8n/client
    res.status(201).json({
      status: 'success',
      data: lead
    });

  } catch (error) {
    // Handle Prisma unique constraint error (URL already exists)
    if (error.code === 'P2002') {
      console.warn(`[⚠️] Lead already exists in database: ${url}`);
      return res.status(409).json({ error: 'Lead already exists in database.' });
    }

    console.error('[❌] Controller Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createLead };