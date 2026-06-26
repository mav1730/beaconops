require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors()); // Allows your future frontend to talk to this API
app.use(express.json()); // Allows your server to read JSON bodies



app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'BeaconOps API is live and breathing.' 
  });
});
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to: ${req.url}`);
  next();
});

const leadroutes = require('./routes/leadRoutes');
app.use('/api/leads',leadroutes);

// Catch-all 404 handler for invalid routes
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Resource not found: ${req.method} ${req.url}`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  // Catch Express body-parser JSON parsing syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'Malformed JSON payload'
    });
  }

  console.error('[❌] Unhandled Server Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// Port Binding
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[🚀] BeaconOps Server initialized on port ${PORT}`);
});