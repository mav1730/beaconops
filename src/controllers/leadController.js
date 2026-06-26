const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import the engines
const { runAudit } = require('../services/lighthouseService');
const { generatePitch } = require('../services/geminiService');

const createLead = async (req, res) => {
  try {
    const { url } = req.body;

    // 1. Run the Audit
    const score = await runAudit(url);

    // 2. Generate Pitch (If the audit succeeded)
    let pitch = null;
    if (score !== null) {
      pitch = await generatePitch(url, score);
    }

    // 3. Save everything to the database
    const lead = await prisma.lead.create({
      data: {
        url,
        score,
        pitch
      }
    });

    // 4. Return the full package back to n8n/client
    res.status(201).json({
      status: 'success',
      data: lead
    });

  } catch (error) {
    console.error('[❌] Controller Error:', error.message);
    
    // Handle Prisma unique constraint error (URL already exists)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Lead already exists in database.' });
    }
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createLead };