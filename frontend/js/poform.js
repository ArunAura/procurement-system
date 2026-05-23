// Purchase Order Form Integration and Auto-Calculations

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const buttonGroup = document.querySelector('.button-group');
  
  let savedPOId = null;

  // 1. Dynamic Print and Download Button Setup
  let downloadBtn = form.querySelector('.download-btn');
  let printBtn = form.querySelector('.print-btn');

  // Set download button style and hide initially (until PO is created)
  if (downloadBtn) {
    downloadBtn.style.display = 'none';
    downloadBtn.addEventListener('click', () => {
      if (savedPOId) {
        window.open(`${API_BASE}/pdf/po/${savedPOId}?action=download`, '_blank');
      }
    });
  }

  // Create print button if it doesn't exist
  if (!printBtn) {
    printBtn = document.createElement('button');
    printBtn.type = 'button';
    printBtn.className = 'print-btn';
    printBtn.innerText = 'Print PO';
    printBtn.style.backgroundColor = '#4a5568';
    printBtn.style.color = 'white';
    printBtn.style.padding = '10px 20px';
    printBtn.style.border = 'none';
    printBtn.style.borderRadius = '6px';
    printBtn.style.cursor = 'pointer';
    printBtn.style.marginRight = '10px';
    printBtn.style.fontWeight = '600';
    printBtn.style.display = 'none';

    printBtn.addEventListener('click', () => {
      if (savedPOId) {
        window.open(`${API_BASE}/pdf/po/${savedPOId}?action=print`, '_blank');
      }
    });

    // Insert next to download button
    buttonGroup.insertBefore(printBtn, buttonGroup.querySelector('.save-btn'));
  }

  // 2. Auto-Calculations
  const rows = form.querySelectorAll('tbody tr');
  const billingInputs = form.querySelector('.billing-grid').querySelectorAll('input');
  
  const subtotalInput = billingInputs[0];
  const cgstInput = billingInputs[1];
  const sgstInput = billingInputs[2];
  const grandTotalInput = billingInputs[3];

  // Disable total inputs to prevent manual error
  if (subtotalInput) subtotalInput.readOnly = true;
  if (grandTotalInput) grandTotalInput.readOnly = true;

  // Helper to calculate totals
  function calculatePO() {
    let subtotal = 0;

    rows.forEach(row => {
      const inputs = row.querySelectorAll('input');
      if (inputs.length >= 8) {
        const qty = parseFloat(inputs[2].value) || 0;
        const unitPrice = parseFloat(inputs[5].value) || 0;
        const charges = parseFloat(inputs[6].value) || 0;
        const totalInput = inputs[7];

        const rowTotal = (qty * unitPrice) + charges;
        
        if (totalInput) {
          totalInput.value = rowTotal > 0 ? rowTotal.toFixed(2) : '';
          totalInput.readOnly = true;
        }

        subtotal += rowTotal;
      }
    });

    if (subtotalInput) {
      subtotalInput.value = subtotal > 0 ? subtotal.toFixed(2) : '';
    }

    // Auto-calculate GST (9% CGST & 9% SGST by default)
    let cgst = 0;
    let sgst = 0;
    
    if (subtotal > 0) {
      cgst = subtotal * 0.09;
      sgst = subtotal * 0.09;
    }

    if (cgstInput && (cgstInput.value === '' || parseFloat(cgstInput.value) === 0 || cgstInput.dataset.auto === 'true')) {
      cgstInput.value = cgst > 0 ? cgst.toFixed(2) : '';
      cgstInput.dataset.auto = 'true';
    }

    if (sgstInput && (sgstInput.value === '' || parseFloat(sgstInput.value) === 0 || sgstInput.dataset.auto === 'true')) {
      sgstInput.value = sgst > 0 ? sgst.toFixed(2) : '';
      sgstInput.dataset.auto = 'true';
    }

    // Read current CGST/SGST (allowing user modifications)
    const currentCgst = parseFloat(cgstInput.value) || 0;
    const currentSgst = parseFloat(sgstInput.value) || 0;

    const grandTotal = subtotal + currentCgst + currentSgst;
    if (grandTotalInput) {
      grandTotalInput.value = grandTotal > 0 ? grandTotal.toFixed(2) : '';
    }
  }

  // Bind calculation to input changes
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    if (inputs.length >= 8) {
      // Qty
      inputs[2].addEventListener('input', calculatePO);
      // Unit Price
      inputs[5].addEventListener('input', calculatePO);
      // Charges
      inputs[6].addEventListener('input', calculatePO);
    }
  });

  // Re-calculate grand total if users modify CGST/SGST manually
  if (cgstInput) {
    cgstInput.addEventListener('input', () => {
      cgstInput.dataset.auto = 'false';
      calculatePO();
    });
  }
  if (sgstInput) {
    sgstInput.addEventListener('input', () => {
      sgstInput.dataset.auto = 'false';
      calculatePO();
    });
  }

  // 3. Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Gather fields by relative indexes
      const shipmentInputs = form.querySelectorAll('.form-grid')[0].querySelectorAll('input');
      const vendorInputs = form.querySelectorAll('.form-grid')[1].querySelectorAll('input');
      const paymentInputs = form.querySelectorAll('.form-grid')[2].querySelectorAll('input');
      const textareas = form.querySelectorAll('textarea');

      const poNumber = shipmentInputs[1] ? shipmentInputs[1].value.trim() : '';

      if (!poNumber) {
        showToast('PO Number is required', 'error');
        return;
      }

      // Collect item rows
      const items = [];
      rows.forEach((row, idx) => {
        const inputs = row.querySelectorAll('input');
        if (inputs.length >= 8) {
          const itemDescription = inputs[0].value.trim();
          
          // Skip if empty description
          if (!itemDescription) return;

          items.push({
            slNo: idx + 1,
            itemDescription: itemDescription,
            hsnCode: inputs[1].value.trim(),
            qty: parseFloat(inputs[2].value) || 0,
            unit: inputs[3].value.trim(),
            deliveryDate: inputs[4].value || null,
            unitPrice: parseFloat(inputs[5].value) || 0,
            charges: parseFloat(inputs[6].value) || 0,
            total: parseFloat(inputs[7].value) || 0
          });
        }
      });

      if (items.length === 0) {
        showToast('Please add at least one item description.', 'error');
        return;
      }

      const payload = {
        shipmentState: shipmentInputs[0] ? shipmentInputs[0].value.trim() : '',
        poNumber: poNumber,
        shipmentStateCode: shipmentInputs[2] ? shipmentInputs[2].value.trim() : '',
        poDate: shipmentInputs[3] ? shipmentInputs[3].value : '',
        shipmentPhone: shipmentInputs[4] ? shipmentInputs[4].value.trim() : '',
        shipmentGstin: shipmentInputs[5] ? shipmentInputs[5].value.trim() : '',
        
        vendorState: vendorInputs[0] ? vendorInputs[0].value.trim() : '',
        vendorName: vendorInputs[1] ? vendorInputs[1].value.trim() : '',
        vendorStateCode: vendorInputs[2] ? vendorInputs[2].value.trim() : '',
        vendorGstin: vendorInputs[3] ? vendorInputs[3].value.trim() : '',
        vendorPhone: vendorInputs[4] ? vendorInputs[4].value.trim() : '',
        placeOfSupply: vendorInputs[5] ? vendorInputs[5].value.trim() : '',

        items: items,

        subtotal: parseFloat(subtotalInput.value) || 0,
        cgst: parseFloat(cgstInput.value) || 0,
        sgst: parseFloat(sgstInput.value) || 0,
        grandTotal: parseFloat(grandTotalInput.value) || 0,

        amountInWords: textareas[0] ? textareas[0].value.trim() : '',
        paymentTerms: paymentInputs[0] ? paymentInputs[0].value.trim() : '',
        paymentMethod: paymentInputs[1] ? paymentInputs[1].value.trim() : '',
        specialTerms: textareas[1] ? textareas[1].value.trim() : ''
      };

      const saveBtn = form.querySelector('.save-btn');
      const originalText = saveBtn.innerText;
      saveBtn.disabled = true;
      saveBtn.innerText = 'Creating PO...';

      try {
        const response = await fetch(`${API_BASE}/purchase-orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showToast('Purchase Order created successfully!', 'success');
          savedPOId = data.poId;

          // Show download/print actions
          if (downloadBtn) downloadBtn.style.display = 'inline-block';
          if (printBtn) printBtn.style.display = 'inline-block';

          saveBtn.innerText = 'Created ✓';
        } else {
          showToast(data.message || 'Error creating purchase order.', 'error');
          saveBtn.disabled = false;
          saveBtn.innerText = originalText;
        }
      } catch (error) {
        console.error('PO submission error:', error);
        showToast('Server connection failed.', 'error');
        saveBtn.disabled = false;
        saveBtn.innerText = originalText;
      }
    });

    // Reset handler
    form.addEventListener('reset', () => {
      savedPOId = null;
      if (downloadBtn) downloadBtn.style.display = 'none';
      if (printBtn) printBtn.style.display = 'none';
      const saveBtn = form.querySelector('.save-btn');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerText = 'Create PO';
      }
    });
  }
});
