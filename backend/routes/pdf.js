const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

// GET /api/pdf/:type/:id - Generates PDF for type ('vendor', 'po', 'indent')
// Optional Query parameter: ?action=print (for browser print preview) or ?action=download (default)
router.get('/:type/:id', pdfController.generatePDF);

module.exports = router;
