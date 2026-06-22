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

const leadroutes = require('./routes/leadRoutes');
app.use('/api/leads',leadroutes);

// Port Binding
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[🚀] BeaconOps Server initialized on port ${PORT}`);
});