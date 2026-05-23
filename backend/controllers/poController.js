const db = require('../database/connection');

// Save a new Purchase Order
exports.createPO = async (req, res, next) => {
  // Get database connection for transaction
  const connection = await db.getConnection();
  
  try {
    const {
      poNumber,
      poDate,
      shipmentState,
      shipmentStateCode,
      shipmentPhone,
      shipmentGstin,
      vendorState,
      vendorName,
      vendorStateCode,
      vendorGstin,
      vendorPhone,
      placeOfSupply,
      subtotal,
      cgst,
      sgst,
      grandTotal,
      amountInWords,
      paymentTerms,
      paymentMethod,
      specialTerms,
      items // Array of items: [{ slNo, itemDescription, hsnCode, qty, unit, deliveryDate, unitPrice, charges, total }]
    } = req.body;

    if (!poNumber) {
      return res.status(400).json({
        success: false,
        message: 'PO Number is required'
      });
    }

    // Start database transaction
    await connection.beginTransaction();

    // 1. Insert Purchase Order Header
    const poQuery = `
      INSERT INTO purchase_orders (
        po_number, po_date, shipment_state, shipment_state_code, shipment_phone, shipment_gstin,
        vendor_state, vendor_name, vendor_state_code, vendor_gstin, vendor_phone, place_of_supply,
        subtotal, cgst, sgst, grand_total, amount_in_words, payment_terms, payment_method, special_terms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const poValues = [
      poNumber, poDate || null, shipmentState, shipmentStateCode, shipmentPhone, shipmentGstin,
      vendorState, vendorName, vendorStateCode, vendorGstin, vendorPhone, placeOfSupply,
      subtotal || 0, cgst || 0, sgst || 0, grandTotal || 0, amountInWords, paymentTerms, paymentMethod, specialTerms
    ];

    const [poResult] = await connection.query(poQuery, poValues);
    const purchaseOrderId = poResult.insertId;

    // 2. Insert Line Items
    if (items && Array.isArray(items) && items.length > 0) {
      const itemQuery = `
        INSERT INTO purchase_order_items (
          purchase_order_id, sl_no, item_description, hsn_code, qty, unit, delivery_date, unit_price, charges, total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      for (const item of items) {
        // Skip empty item rows
        if (!item.itemDescription || item.itemDescription.trim() === '') {
          continue;
        }

        const itemValues = [
          purchaseOrderId,
          item.slNo || 1,
          item.itemDescription,
          item.hsnCode || null,
          item.qty || 0,
          item.unit || null,
          item.deliveryDate || null,
          item.unitPrice || 0,
          item.charges || 0,
          item.total || 0
        ];

        await connection.query(itemQuery, itemValues);
      }
    }

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Purchase Order created successfully',
      poId: purchaseOrderId
    });

  } catch (error) {
    // Rollback transaction in case of error
    await connection.rollback();
    next(error);
  } finally {
    // Release connection back to pool
    connection.release();
  }
};

// Get all Purchase Orders
exports.getPOs = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM purchase_orders ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// Get single Purchase Order by ID
exports.getPOById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Fetch PO Header
    const [poRows] = await db.query('SELECT * FROM purchase_orders WHERE id = ?', [id]);
    
    if (poRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase Order not found'
      });
    }

    // Fetch PO Line Items
    const [itemRows] = await db.query(
      'SELECT * FROM purchase_order_items WHERE purchase_order_id = ? ORDER BY sl_no ASC',
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        ...poRows[0],
        items: itemRows
      }
    });

  } catch (error) {
    next(error);
  }
};
