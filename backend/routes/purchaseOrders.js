const express = require('express');
const router = express.Router();
const poController = require('../controllers/poController');

// GET /api/purchase-orders - Get all POs
router.get('/', poController.getPOs);

// GET /api/purchase-orders/:id - Get PO details by ID (joins items)
router.get('/:id', poController.getPOById);

// POST /api/purchase-orders - Save new PO
router.post('/', poController.createPO);

module.exports = router;
