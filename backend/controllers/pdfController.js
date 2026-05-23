const db = require('../database/connection');
const pdfGenerator = require('../pdf/pdfGenerator');

// Generate and stream PDF based on type and ID
exports.generatePDF = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { action } = req.query; // 'download' or 'print' (default is download)

    // Determine content disposition (attachment vs inline)
    const disposition = action === 'print' ? 'inline' : 'attachment';
    const filename = `${type}_${id}.pdf`;

    if (type === 'vendor') {
      // 1. Fetch Vendor
      const [rows] = await db.query('SELECT * FROM vendors WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }

      const vendor = rows[0];
      
      // Set PDF Headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `${disposition}; filename="${filename}"`);

      // Generate PDF directly into the response stream
      pdfGenerator.generateVendorPDF(vendor, res);

    } else if (type === 'po') {
      // 2. Fetch Purchase Order Header
      const [poRows] = await db.query('SELECT * FROM purchase_orders WHERE id = ?', [id]);
      if (poRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Purchase Order not found' });
      }

      const po = poRows[0];

      // Fetch Purchase Order Items
      const [itemRows] = await db.query(
        'SELECT * FROM purchase_order_items WHERE purchase_order_id = ? ORDER BY sl_no ASC',
        [id]
      );

      // Set PDF Headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `${disposition}; filename="${filename}"`);

      // Generate PDF
      pdfGenerator.generatePOPDF(po, itemRows, res);

    } else if (type === 'indent') {
      // 3. Fetch Indent Header
      const [indentRows] = await db.query('SELECT * FROM indent_requests WHERE id = ?', [id]);
      if (indentRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Indent Request not found' });
      }

      const indent = indentRows[0];

      // Fetch Indent Items
      const [itemRows] = await db.query(
        'SELECT * FROM indent_request_items WHERE indent_request_id = ? ORDER BY sl_no ASC',
        [id]
      );

      // Set PDF Headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `${disposition}; filename="${filename}"`);

      // Generate PDF
      pdfGenerator.generateIndentPDF(indent, itemRows, res);

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type. Must be vendor, po, or indent'
      });
    }

  } catch (error) {
    next(error);
  }
};
