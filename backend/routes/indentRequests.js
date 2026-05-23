const express = require('express');
const router = express.Router();
const indentController = require('../controllers/indentController');

// GET /api/indents - Get all indents
router.get('/', indentController.getIndents);

// GET /api/indents/:id - Get indent details by ID
router.get('/:id', indentController.getIndentById);

// POST /api/indents - Save new indent request
router.post('/', indentController.createIndent);

module.exports = router;
