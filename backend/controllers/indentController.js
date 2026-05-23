const db = require('../database/connection');

// Save a new Indent Requisition
exports.createIndent = async (req, res, next) => {
  const connection = await db.getConnection();
  
  try {
    const {
      indentNumber,
      indentDate,
      requestedBy,
      department,
      requiredDate,
      designation,
      reasonForRequirement,
      preparedByName,
      preparedBySig,
      preparedByDate,
      verifiedByName,
      verifiedBySig,
      verifiedByDate,
      approvedByName,
      approvedBySig,
      approvedByDate,
      items // Array of items: [{ slNo, itemDescription, qty, remarks }]
    } = req.body;

    if (!indentNumber) {
      return res.status(400).json({
        success: false,
        message: 'Indent Number is required'
      });
    }

    // Start transaction
    await connection.beginTransaction();

    // 1. Insert Indent Header
    const indentQuery = `
      INSERT INTO indent_requests (
        indent_number, indent_date, requested_by, department, required_date, designation, reason_for_requirement,
        prepared_by_name, prepared_by_sig, prepared_by_date,
        verified_by_name, verified_by_sig, verified_by_date,
        approved_by_name, approved_by_sig, approved_by_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const indentValues = [
      indentNumber, indentDate || null, requestedBy, department, requiredDate || null, designation, reasonForRequirement,
      preparedByName, preparedBySig, preparedByDate || null,
      verifiedByName, verifiedBySig, verifiedByDate || null,
      approvedByName, approvedBySig, approvedByDate || null
    ];

    const [indentResult] = await connection.query(indentQuery, indentValues);
    const indentId = indentResult.insertId;

    // 2. Insert Line Items
    if (items && Array.isArray(items) && items.length > 0) {
      const itemQuery = `
        INSERT INTO indent_request_items (
          indent_request_id, sl_no, item_description, qty, remarks
        ) VALUES (?, ?, ?, ?, ?)
      `;

      for (const item of items) {
        // Skip empty rows
        if (!item.itemDescription || item.itemDescription.trim() === '') {
          continue;
        }

        const itemValues = [
          indentId,
          item.slNo || 1,
          item.itemDescription,
          item.qty || 0,
          item.remarks || null
        ];

        await connection.query(itemQuery, itemValues);
      }
    }

    // Commit Transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Indent request created successfully',
      indentId: indentId
    });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// Get all Indent Requests
exports.getIndents = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM indent_requests ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// Get single Indent Request by ID
exports.getIndentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch Indent Header
    const [indentRows] = await db.query('SELECT * FROM indent_requests WHERE id = ?', [id]);

    if (indentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Indent Requisition not found'
      });
    }

    // Fetch Indent Items
    const [itemRows] = await db.query(
      'SELECT * FROM indent_request_items WHERE indent_request_id = ? ORDER BY sl_no ASC',
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        ...indentRows[0],
        items: itemRows
      }
    });

  } catch (error) {
    next(error);
  }
};
