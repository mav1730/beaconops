// src/routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const { createLead } = require('../controllers/leadController');
const { validateLead } = require('../validations/leadValidation'); // Import the bouncer

// The Request flows left to right: Route -> Bouncer -> Waiter
router.post('/', validateLead, createLead);

module.exports = router;