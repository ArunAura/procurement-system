const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const poRoutes = require('./routes/purchaseOrders');
const indentRoutes = require('./routes/indentRequests');
const pdfRoutes = require('./routes/pdf');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend static files
// This mounts the frontend files so that http://localhost:3000/login.html works out-of-the-box
app.use(express.static(path.join(__dirname, '../frontend')));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/purchase-orders', poRoutes);
app.use('/api/indents', indentRoutes);
app.use('/api/pdf', pdfRoutes);

// Fallback route for index/dashboard if someone hits the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// Error handling middleware (must be registered last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`ProcureFlow Server running on port ${PORT}`);
  console.log(`Access frontend at: http://localhost:${PORT}/login.html`);
  console.log(`==================================================`);
});
x