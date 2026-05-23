const db = require('../database/connection');

// Save vendor registration
exports.createVendor = async (req, res, next) => {
  try {
    const {
      companyName,
      vendorType,
      address,
      gstNumber,
      panNumber,
      contactPerson,
      phoneNumber,
      email,
      website,
      bankName,
      accountNumber,
      ifscCode,
      branchName,
      productsServices,
      deliveryTimeline,
      paymentTerms,
      documents // Array of strings (e.g., ["GST Certificate", "PAN Card"])
    } = req.body;

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company Name is required'
      });
    }

    const documentsJson = JSON.stringify(documents || []);

    const query = `
      INSERT INTO vendors (
        company_name, vendor_type, address, gst_number, pan_number,
        contact_person, phone_number, email, website,
        bank_name, account_number, ifsc_code, branch_name,
        products_services, delivery_timeline, payment_terms, documents
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      companyName, vendorType, address, gstNumber, panNumber,
      contactPerson, phoneNumber, email, website,
      bankName, accountNumber, ifscCode, branchName,
      productsServices, deliveryTimeline, paymentTerms, documentsJson
    ];

    const [result] = await db.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Vendor registered successfully',
      vendorId: result.insertId
    });

  } catch (error) {
    next(error);
  }
};

// Get all vendors (for list or dashboard stats)
exports.getVendors = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM vendors ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// Get single vendor by ID
exports.getVendorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM vendors WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    const vendor = rows[0];
    
    // Parse documents JSON back to array
    try {
      vendor.documents = JSON.parse(vendor.documents);
    } catch (e) {
      vendor.documents = [];
    }

    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};
