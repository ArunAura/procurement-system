const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

// GET /api/vendors - Get all vendors
router.get('/', vendorController.getVendors);

// GET /api/vendors/:id - Get vendor by ID
router.get('/:id', vendorController.getVendorById);

// POST /api/vendors - Save new vendor registration
router.post('/', vendorController.createVendor);

module.exports = router;
