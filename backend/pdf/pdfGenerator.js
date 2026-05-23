const PDFDocument = require('pdfkit');

// Helper to draw the standard hospital header
function drawHospitalHeader(doc) {
  // Brand color (deep teal/blue)
  doc.fillColor('#1a365d');
  
  // Hospital Title
  doc.fontSize(18).font('Helvetica-Bold').text('SMILES INSTITUTE OF GASTROENTEROLOGY LLP', 50, 45, { align: 'center' });
  
  // Hospital Details
  doc.fillColor('#4a5568');
  doc.fontSize(9).font('Helvetica').text('No.423, 1st Main Road, 1st Stage, Mathikere, Bengaluru - 560054', 50, 68, { align: 'center' });
  doc.text('Karnataka, India | Phone: +91 XXXXXXXXXX | Email: contact@smilesgastro.com', 50, 80, { align: 'center' });
  
  // Decorative line
  doc.strokeColor('#cbd5e0').lineWidth(1).moveTo(50, 95).lineTo(545, 95).stroke();
}

// Helper to draw a section title block
function drawSectionTitle(doc, title, y) {
  doc.fillColor('#2b6cb0');
  doc.fontSize(11).font('Helvetica-Bold').text(title.toUpperCase(), 50, y);
  doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, y + 15).lineTo(545, y + 15).stroke();
}

// Helper to format date
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Generates a Vendor Registration PDF
 */
function generateVendorPDF(vendor, stream) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(stream);

  // 1. Header
  drawHospitalHeader(doc);

  // 2. Document Title
  doc.fillColor('#2d3748').fontSize(14).font('Helvetica-Bold').text('VENDOR REGISTRATION Certificate', 50, 110, { align: 'center' });

  // Registration ID Box
  doc.rect(50, 130, 495, 30).fill('#edf2f7');
  doc.fillColor('#2d3748').fontSize(10).font('Helvetica-Bold').text(`Registration ID: VEN-${String(vendor.id).padStart(4, '0')}`, 60, 140);
  doc.text(`Date of Registration: ${formatDate(vendor.created_at)}`, 350, 140);

  // 3. Company Details
  drawSectionTitle(doc, 'Company Details', 175);
  
  let y = 200;
  const leftColX = 60;
  const rightColX = 300;
  const lineSpacing = 18;

  doc.fillColor('#4a5568').fontSize(9).font('Helvetica-Bold');
  
  doc.text('Company Name:', leftColX, y);
  doc.font('Helvetica').text(vendor.company_name || 'N/A', leftColX + 90, y);

  doc.font('Helvetica-Bold').text('Vendor Type:', rightColX, y);
  doc.font('Helvetica').text(vendor.vendor_type || 'N/A', rightColX + 90, y);

  y += lineSpacing;
  doc.font('Helvetica-Bold').text('GST Number:', leftColX, y);
  doc.font('Helvetica').text(vendor.gst_number || 'N/A', leftColX + 90, y);

  doc.font('Helvetica-Bold').text('PAN Number:', rightColX, y);
  doc.font('Helvetica').text(vendor.pan_number || 'N/A', rightColX + 90, y);

  y += lineSpacing;
  doc.font('Helvetica-Bold').text('Company Address:', leftColX, y);
  // Multi-line address wrap support
  doc.font('Helvetica').text(vendor.address || 'N/A', leftColX + 90, y, { width: 340 });

  // 4. Contact Details
  y = 280;
  drawSectionTitle(doc, 'Contact Details', y);
  y += 25;

  doc.fillColor('#4a5568').fontSize(9).font('Helvetica-Bold');
  
  doc.text('Contact Person:', leftColX, y);
  doc.font('Helvetica').text(vendor.contact_person || 'N/A', leftColX + 90, y);

  doc.font('Helvetica-Bold').text('Phone Number:', rightColX, y);
  doc.font('Helvetica').text(vendor.phone_number || 'N/A', rightColX + 90, y);

  y += lineSpacing;
  doc.font('Helvetica-Bold').text('Email Address:', leftColX, y);
  doc.font('Helvetica').text(vendor.email || 'N/A', leftColX + 90, y);

  doc.font('Helvetica-Bold').text('Website:', rightColX, y);
  doc.font('Helvetica').text(vendor.website || 'N/A', rightColX + 90, y);

  // 5. Bank Details
  y = 360;
  drawSectionTitle(doc, 'Bank Details', y);
  y += 25;

  doc.fillColor('#4a5568').fontSize(9).font('Helvetica-Bold');
  
  doc.text('Bank Name:', leftColX, y);
  doc.font('Helvetica').text(vendor.bank_name || 'N/A', leftColX + 90, y);

  doc.font('Helvetica-Bold').text('Account Number:', rightColX, y);
  doc.font('Helvetica').text(vendor.account_number || 'N/A', rightColX + 90, y);

  y += lineSpacing;
  doc.font('Helvetica-Bold').text('IFSC Code:', leftColX, y);
  doc.font('Helvetica').text(vendor.ifsc_code || 'N/A', leftColX + 90, y);

  doc.font('Helvetica-Bold').text('Branch Name:', rightColX, y);
  doc.font('Helvetica').text(vendor.branch_name || 'N/A', rightColX + 90, y);

  // 6. Procurement & Verification Details
  y = 440;
  drawSectionTitle(doc, 'Procurement details', y);
  y += 25;

  doc.fillColor('#4a5568').fontSize(9).font('Helvetica-Bold');
  
  doc.text('Products/Services:', leftColX, y);
  doc.font('Helvetica').text(vendor.products_services || 'N/A', leftColX + 95, y);

  doc.font('Helvetica-Bold').text('Delivery Timeline:', rightColX, y);
  doc.font('Helvetica').text(vendor.delivery_timeline || 'N/A', rightColX + 90, y);

  y += lineSpacing;
  doc.font('Helvetica-Bold').text('Payment Terms:', leftColX, y);
  doc.font('Helvetica').text(vendor.payment_terms || 'N/A', leftColX + 95, y);

  // Documents
  y = 510;
  drawSectionTitle(doc, 'Submitted Documents Verification', y);
  y += 25;

  let docsArray = [];
  try {
    if (vendor.documents) {
      docsArray = typeof vendor.documents === 'string' ? JSON.parse(vendor.documents) : vendor.documents;
    }
  } catch (e) {
    docsArray = [];
  }

  doc.fillColor('#4a5568').fontSize(9).font('Helvetica');
  const docList = ['GST Certificate', 'PAN Card', 'Cancelled Cheque', 'Vendor Agreement'];
  
  docList.forEach((dName, index) => {
    const isSubmitted = docsArray.includes(dName);
    const docX = leftColX + (index % 2) * 220;
    const docY = y + Math.floor(index / 2) * 20;

    // Draw box representing checkbox
    doc.strokeColor('#a0aec0').lineWidth(1).rect(docX, docY, 10, 10).stroke();
    if (isSubmitted) {
      doc.fillColor('#2b6cb0').fontSize(8).text('X', docX + 2, docY + 1);
    }
    doc.fillColor('#4a5568').fontSize(9).text(dName, docX + 18, docY + 1);
  });

  // 7. Footer/Signatures
  y = 650;
  doc.strokeColor('#cbd5e0').lineWidth(0.5).moveTo(50, y).lineTo(545, y).stroke();
  
  y += 15;
  doc.fontSize(8).fillColor('#a0aec0').text('This is a computer-generated registration document. No physical signature is required.', 50, y, { align: 'center' });
  doc.text('Smiles Institute of Gastroenterology LLP | Procurement Office', 50, y + 10, { align: 'center' });

  doc.end();
}

/**
 * Generates a Purchase Order PDF
 */
function generatePOPDF(po, items, stream) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(stream);

  // 1. Header
  drawHospitalHeader(doc);

  // 2. Title
  doc.fillColor('#2d3748').fontSize(14).font('Helvetica-Bold').text('PURCHASE ORDER', 50, 110, { align: 'center' });

  // 3. PO Metadata
  doc.rect(50, 130, 495, 45).fill('#edf2f7');
  doc.fillColor('#2d3748').fontSize(9).font('Helvetica-Bold');
  
  doc.text(`PO Number: ${po.po_number}`, 60, 138);
  doc.text(`PO Date: ${formatDate(po.po_date)}`, 60, 154);

  doc.text(`Place of Supply: ${po.place_of_supply || 'N/A'}`, 320, 138);
  doc.text(`Created Date: ${formatDate(po.created_at)}`, 320, 154);

  // 4. Addresses (Shipment vs Vendor)
  const boxWidth = 238;
  const boxHeight = 110;
  
  // Shipment Box (Left)
  doc.strokeColor('#cbd5e0').lineWidth(1).rect(50, 190, boxWidth, boxHeight).stroke();
  doc.fillColor('#2b6cb0').fontSize(10).font('Helvetica-Bold').text('SHIPMENT ADDRESS', 60, 198);
  doc.fillColor('#4a5568').fontSize(8).font('Helvetica');
  doc.text(`State: ${po.shipment_state || ''}`, 60, 215);
  doc.text(`State Code: ${po.shipment_state_code || ''}`, 60, 227);
  doc.text(`GSTIN No: ${po.shipment_gstin || ''}`, 60, 239);
  doc.text(`Phone: ${po.shipment_phone || ''}`, 60, 251);

  // Vendor Box (Right)
  doc.strokeColor('#cbd5e0').lineWidth(1).rect(307, 190, boxWidth, boxHeight).stroke();
  doc.fillColor('#2b6cb0').fontSize(10).font('Helvetica-Bold').text('VENDOR ADDRESS', 317, 198);
  doc.fillColor('#4a5568').fontSize(8).font('Helvetica');
  doc.text(`Vendor Name: ${po.vendor_name || ''}`, 317, 215);
  doc.text(`State: ${po.vendor_state || ''}`, 317, 227);
  doc.text(`State Code: ${po.vendor_state_code || ''}`, 317, 239);
  doc.text(`GSTIN No: ${po.vendor_gstin || ''}`, 317, 251);
  doc.text(`Phone: ${po.vendor_phone || ''}`, 317, 263);

  // 5. Item Table
  let tableY = 320;
  drawSectionTitle(doc, 'Item details', tableY);
  tableY += 25;

  // Table Headers
  const colWidths = { sl: 25, desc: 155, hsn: 45, qty: 30, unit: 30, date: 55, price: 50, charges: 45, total: 60 };
  const colPositions = {
    sl: 50,
    desc: 50 + colWidths.sl,
    hsn: 50 + colWidths.sl + colWidths.desc,
    qty: 50 + colWidths.sl + colWidths.desc + colWidths.hsn,
    unit: 50 + colWidths.sl + colWidths.desc + colWidths.hsn + colWidths.qty,
    date: 50 + colWidths.sl + colWidths.desc + colWidths.hsn + colWidths.qty + colWidths.unit,
    price: 50 + colWidths.sl + colWidths.desc + colWidths.hsn + colWidths.qty + colWidths.unit + colWidths.date,
    charges: 50 + colWidths.sl + colWidths.desc + colWidths.hsn + colWidths.qty + colWidths.unit + colWidths.date + colWidths.price,
    total: 50 + colWidths.sl + colWidths.desc + colWidths.hsn + colWidths.qty + colWidths.unit + colWidths.date + colWidths.price + colWidths.charges
  };

  // Draw table header background
  doc.rect(50, tableY, 495, 18).fill('#4a5568');
  doc.fillColor('#ffffff').fontSize(7).font('Helvetica-Bold');
  
  doc.text('Sl', colPositions.sl + 5, tableY + 5);
  doc.text('Item Description', colPositions.desc + 5, tableY + 5);
  doc.text('HSN', colPositions.hsn + 5, tableY + 5);
  doc.text('Qty', colPositions.qty + 5, tableY + 5);
  doc.text('Unit', colPositions.unit + 5, tableY + 5);
  doc.text('Deliv Date', colPositions.date + 5, tableY + 5);
  doc.text('Unit Price', colPositions.price + 5, tableY + 5);
  doc.text('Charges', colPositions.charges + 5, tableY + 5);
  doc.text('Total', colPositions.total + 5, tableY + 5);

  tableY += 18;

  // Draw Table Rows
  doc.fillColor('#4a5568').font('Helvetica').fontSize(7);
  let hasItems = false;

  items.forEach((item, index) => {
    // Only render items with text description
    if (!item.item_description || item.item_description.trim() === '') return;
    hasItems = true;

    // Alternating background colors
    if (index % 2 === 1) {
      doc.rect(50, tableY, 495, 18).fill('#f7fafc');
      doc.fillColor('#4a5568'); // restore color after fill
    }

    doc.text(String(index + 1), colPositions.sl + 5, tableY + 5);
    doc.text(item.item_description, colPositions.desc + 5, tableY + 5, { width: colWidths.desc - 10, height: 12 });
    doc.text(item.hsn_code || '-', colPositions.hsn + 5, tableY + 5);
    doc.text(String(item.qty || 0), colPositions.qty + 5, tableY + 5);
    doc.text(item.unit || '-', colPositions.unit + 5, tableY + 5);
    doc.text(formatDate(item.delivery_date), colPositions.date + 5, tableY + 5);
    doc.text(Number(item.unit_price || 0).toFixed(2), colPositions.price + 5, tableY + 5);
    doc.text(Number(item.charges || 0).toFixed(2), colPositions.charges + 5, tableY + 5);
    doc.text(Number(item.total || 0).toFixed(2), colPositions.total + 5, tableY + 5);

    // Row bottom borders
    doc.strokeColor('#e2e8f0').lineWidth(0.5).moveTo(50, tableY + 18).lineTo(545, tableY + 18).stroke();
    tableY += 18;
  });

  if (!hasItems) {
    doc.text('No items specified.', 60, tableY + 5);
    tableY += 18;
  }

  // 6. Billing Summary
  let summaryY = tableY + 15;
  doc.strokeColor('#cbd5e0').lineWidth(0.5).moveTo(50, summaryY).lineTo(545, summaryY).stroke();
  summaryY += 10;

  // Draw terms on the left, totals on the right
  doc.fontSize(8);
  doc.font('Helvetica-Bold').fillColor('#2d3748').text('Payment Method:', 50, summaryY);
  doc.font('Helvetica').fillColor('#4a5568').text(po.payment_method || 'N/A', 130, summaryY);

  doc.font('Helvetica-Bold').fillColor('#2d3748').text('Subtotal:', 380, summaryY);
  doc.font('Helvetica').fillColor('#4a5568').text(`Rs. ${Number(po.subtotal || 0).toFixed(2)}`, 460, summaryY, { align: 'right', width: 80 });

  summaryY += 13;
  doc.font('Helvetica-Bold').fillColor('#2d3748').text('Payment Terms:', 50, summaryY);
  doc.font('Helvetica').fillColor('#4a5568').text(po.payment_terms || 'N/A', 130, summaryY);

  doc.font('Helvetica-Bold').fillColor('#2d3748').text('CGST:', 380, summaryY);
  doc.font('Helvetica').fillColor('#4a5568').text(`Rs. ${Number(po.cgst || 0).toFixed(2)}`, 460, summaryY, { align: 'right', width: 80 });

  summaryY += 13;
  doc.font('Helvetica-Bold').fillColor('#2d3748').text('Amount in Words:', 50, summaryY);
  doc.font('Helvetica').fillColor('#4a5568').text(po.amount_in_words || 'N/A', 130, summaryY, { width: 230 });

  doc.font('Helvetica-Bold').fillColor('#2d3748').text('SGST:', 380, summaryY);
  doc.font('Helvetica').fillColor('#4a5568').text(`Rs. ${Number(po.sgst || 0).toFixed(2)}`, 460, summaryY, { align: 'right', width: 80 });

  summaryY += 15;
  // Grand total highlight
  doc.rect(370, summaryY - 3, 175, 18).fill('#edf2f7');
  doc.font('Helvetica-Bold').fillColor('#2d3748').text('Grand Total:', 380, summaryY);
  doc.font('Helvetica-Bold').fillColor('#2d3748').text(`Rs. ${Number(po.grand_total || 0).toFixed(2)}`, 460, summaryY, { align: 'right', width: 80 });

  summaryY += 25;

  // 7. Special Terms
  if (po.special_terms && po.special_terms.trim() !== '') {
    drawSectionTitle(doc, 'Special Terms and Conditions', summaryY);
    summaryY += 22;
    doc.fillColor('#4a5568').fontSize(7.5).font('Helvetica').text(po.special_terms, 55, summaryY, { width: 480 });
    summaryY += doc.heightOfString(po.special_terms, { width: 480 }) + 15;
  }

  // 8. Signatures
  let sigY = Math.max(summaryY + 10, 680);
  doc.strokeColor('#cbd5e0').lineWidth(0.5).moveTo(50, sigY).lineTo(545, sigY).stroke();
  sigY += 15;

  doc.fontSize(8).fillColor('#4a5568').font('Helvetica-Bold');
  doc.text('Prepared By:', 60, sigY);
  doc.text('Authorized Signatory:', 380, sigY);

  doc.font('Helvetica').fontSize(7.5);
  doc.text('Procurement Officer', 60, sigY + 12);
  doc.text('Smiles Institute of Gastroenterology LLP', 380, sigY + 12);

  doc.end();
}

/**
 * Generates an Indent Request PDF
 */
function generateIndentPDF(indent, items, stream) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(stream);

  // 1. Header
  drawHospitalHeader(doc);

  // 2. Title
  doc.fillColor('#2d3748').fontSize(14).font('Helvetica-Bold').text('INDENT REQUISITION', 50, 110, { align: 'center' });

  // 3. Indent Details Grid
  doc.rect(50, 130, 495, 65).fill('#edf2f7');
  doc.fillColor('#2d3748').fontSize(9).font('Helvetica-Bold');

  const x1 = 60;
  const x2 = 300;
  let gridY = 138;
  const gap = 16;

  doc.text(`Indent Number: ${indent.indent_number}`, x1, gridY);
  doc.text(`Date: ${formatDate(indent.indent_date)}`, x2, gridY);

  gridY += gap;
  doc.text(`Requested By: ${indent.requested_by}`, x1, gridY);
  doc.text(`Department: ${indent.department}`, x2, gridY);

  gridY += gap;
  doc.text(`Designation: ${indent.designation || 'N/A'}`, x1, gridY);
  doc.text(`Required Date: ${formatDate(indent.required_date)}`, x2, gridY);

  // 4. Item Table
  let tableY = 215;
  drawSectionTitle(doc, 'Item details', tableY);
  tableY += 25;

  const colWidths = { sl: 35, name: 300, qty: 60, remarks: 100 };
  const colPositions = {
    sl: 50,
    name: 50 + colWidths.sl,
    qty: 50 + colWidths.sl + colWidths.name,
    remarks: 50 + colWidths.sl + colWidths.name + colWidths.qty
  };

  // Header
  doc.rect(50, tableY, 495, 18).fill('#4a5568');
  doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
  doc.text('Sl. No', colPositions.sl + 5, tableY + 5);
  doc.text('Item Name & Description', colPositions.name + 5, tableY + 5);
  doc.text('Quantity', colPositions.qty + 5, tableY + 5);
  doc.text('Remarks', colPositions.remarks + 5, tableY + 5);

  tableY += 18;

  // Rows
  doc.fillColor('#4a5568').font('Helvetica').fontSize(8);
  let hasItems = false;

  items.forEach((item, index) => {
    if (!item.item_description || item.item_description.trim() === '') return;
    hasItems = true;

    if (index % 2 === 1) {
      doc.rect(50, tableY, 495, 18).fill('#f7fafc');
      doc.fillColor('#4a5568');
    }

    doc.text(String(index + 1), colPositions.sl + 5, tableY + 5);
    doc.text(item.item_description, colPositions.name + 5, tableY + 5, { width: colWidths.name - 10, height: 12 });
    doc.text(String(item.qty || 0), colPositions.qty + 5, tableY + 5);
    doc.text(item.remarks || '-', colPositions.remarks + 5, tableY + 5);

    doc.strokeColor('#e2e8f0').lineWidth(0.5).moveTo(50, tableY + 18).lineTo(545, tableY + 18).stroke();
    tableY += 18;
  });

  if (!hasItems) {
    doc.text('No items specified.', 60, tableY + 5);
    tableY += 18;
  }

  // 5. Reason for Requirement
  let reasonY = tableY + 15;
  if (indent.reason_for_requirement && indent.reason_for_requirement.trim() !== '') {
    drawSectionTitle(doc, 'Reason For Requirement', reasonY);
    reasonY += 22;
    doc.fillColor('#4a5568').fontSize(8.5).font('Helvetica').text(indent.reason_for_requirement, 55, reasonY, { width: 480 });
    reasonY += doc.heightOfString(indent.reason_for_requirement, { width: 480 }) + 20;
  }

  // 6. Approval Section (Side-by-side Cards)
  let approvalY = Math.max(reasonY + 10, 520);
  drawSectionTitle(doc, 'Approval Details', approvalY);
  approvalY += 25;

  const cardW = 153;
  const cardH = 110;
  const cardGap = 18;

  // Box 1: Prepared By
  let cX = 50;
  doc.strokeColor('#cbd5e0').lineWidth(1).rect(cX, approvalY, cardW, cardH).stroke();
  doc.rect(cX, approvalY, cardW, 18).fill('#edf2f7');
  doc.fillColor('#2d3748').fontSize(8.5).font('Helvetica-Bold').text('Prepared By', cX + 8, approvalY + 5);
  doc.fillColor('#4a5568').fontSize(7.5).font('Helvetica');
  doc.text(`Name: ${indent.prepared_by_name || 'N/A'}`, cX + 8, approvalY + 28);
  doc.text(`Signature: ${indent.prepared_by_sig || 'N/A'}`, cX + 8, approvalY + 48, { width: cardW - 16 });
  doc.text(`Date: ${formatDate(indent.prepared_by_date)}`, cX + 8, approvalY + 85);

  // Box 2: Verified By
  cX += cardW + cardGap;
  doc.strokeColor('#cbd5e0').lineWidth(1).rect(cX, approvalY, cardW, cardH).stroke();
  doc.rect(cX, approvalY, cardW, 18).fill('#edf2f7');
  doc.fillColor('#2d3748').fontSize(8.5).font('Helvetica-Bold').text('Verified By', cX + 8, approvalY + 5);
  doc.fillColor('#4a5568').fontSize(7.5).font('Helvetica');
  doc.text(`Name: ${indent.verified_by_name || 'N/A'}`, cX + 8, approvalY + 28);
  doc.text(`Signature: ${indent.verified_by_sig || 'N/A'}`, cX + 8, approvalY + 48, { width: cardW - 16 });
  doc.text(`Date: ${formatDate(indent.verified_by_date)}`, cX + 8, approvalY + 85);

  // Box 3: Approved By
  cX += cardW + cardGap;
  doc.strokeColor('#cbd5e0').lineWidth(1).rect(cX, approvalY, cardW, cardH).stroke();
  doc.rect(cX, approvalY, cardW, 18).fill('#edf2f7');
  doc.fillColor('#2d3748').fontSize(8.5).font('Helvetica-Bold').text('Approved By', cX + 8, approvalY + 5);
  doc.fillColor('#4a5568').fontSize(7.5).font('Helvetica');
  doc.text(`Name: ${indent.approved_by_name || 'N/A'}`, cX + 8, approvalY + 28);
  doc.text(`Signature: ${indent.approved_by_sig || 'N/A'}`, cX + 8, approvalY + 48, { width: cardW - 16 });
  doc.text(`Date: ${formatDate(indent.approved_by_date)}`, cX + 8, approvalY + 85);

  // Footer
  const footerY = 670;
  doc.strokeColor('#cbd5e0').lineWidth(0.5).moveTo(50, footerY).lineTo(545, footerY).stroke();
  doc.fillColor('#a0aec0').fontSize(8).text('Smiles Institute of Gastroenterology LLP | Internal Procurement Document', 50, footerY + 15, { align: 'center' });

  doc.end();
}

module.exports = {
  generateVendorPDF,
  generatePOPDF,
  generateIndentPDF
};
