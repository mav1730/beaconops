// src/controllers/leadController.js
const prisma = require('../config/db');

exports.createLead = async (req, res) => {
  try {
    const { url } = req.body; // We know this is 100% safe and valid now

    const newLead = await prisma.lead.create({
      data: {
        url: url,
        status: 'PENDING_AUDIT'
      }
    });

    res.status(201).json({
      message: 'Lead successfully ingested.',
      data: newLead
    });

  } catch (error) {
    console.error('[!] Database Error:', error);
    res.status(500).json({ error: 'Internal Server Error while saving lead.' });
  }
};