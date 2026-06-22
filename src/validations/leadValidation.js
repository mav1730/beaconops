// src/validations/leadValidation.js
const { z } = require('zod');

// Define the strict rules
const leadSchema = z.object({
  url: z.string().url({ message: "Invalid format. Must be a valid URL (e.g., https://example.com)." })
});

// The Middleware Function
const validateLead = (req, res, next) => {
  // safeParse does not throw code-breaking errors. It simply returns success: true or false.
  const validation = leadSchema.safeParse(req.body);

  if (!validation.success) {
    // If validation fails, extract the errors cleanly
    const errorMessages = validation.error.issues.map(err => err.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      details: errorMessages
    });
  }

  // If validation passes, let them through to the Waiter
  next(); 
};

module.exports = { validateLead };