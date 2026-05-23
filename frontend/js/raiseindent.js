// Raise Indent Form Integration

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const buttonGroup = document.querySelector('.button-group');
  
  let savedIndentId = null;

  // 1. Dynamic Print and Download Button Setup
  let downloadBtn = form.querySelector('.download-btn');
  let printBtn = form.querySelector('.print-btn');

  // Configure download button
  if (downloadBtn) {
    downloadBtn.style.display = 'none';
    downloadBtn.addEventListener('click', () => {
      if (savedIndentId) {
        window.open(`${API_BASE}/pdf/indent/${savedIndentId}?action=download`, '_blank');
      }
    });
  }

  // Create print button
  if (!printBtn) {
    printBtn = document.createElement('button');
    printBtn.type = 'button';
    printBtn.className = 'print-btn';
    printBtn.innerText = 'Print Indent';
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
      if (savedIndentId) {
        window.open(`${API_BASE}/pdf/indent/${savedIndentId}?action=print`, '_blank');
      }
    });

    buttonGroup.insertBefore(printBtn, buttonGroup.querySelector('.save-btn'));
  }

  // 2. Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Gather Basic Details
      const basicInputs = form.querySelectorAll('.form-grid')[0].querySelectorAll('input');
      const deptSelect = form.querySelector('.form-grid select');

      const indentNumber = basicInputs[0] ? basicInputs[0].value.trim() : '';
      const indentDate = basicInputs[1] ? basicInputs[1].value : '';
      const requestedBy = basicInputs[2] ? basicInputs[2].value.trim() : '';
      const department = deptSelect ? deptSelect.value : '';
      const requiredDate = basicInputs[3] ? basicInputs[3].value : '';
      const designation = basicInputs[4] ? basicInputs[4].value.trim() : '';

      if (!indentNumber) {
        showToast('Indent Number is required', 'error');
        return;
      }
      if (!requestedBy) {
        showToast('Requested By field is required', 'error');
        return;
      }

      // Gather Line Items
      const rows = form.querySelectorAll('tbody tr');
      const items = [];
      rows.forEach((row, idx) => {
        const inputs = row.querySelectorAll('input');
        if (inputs.length >= 3) {
          const itemDescription = inputs[0].value.trim();
          
          if (!itemDescription) return; // Skip empty descriptions

          items.push({
            slNo: idx + 1,
            itemDescription: itemDescription,
            qty: parseFloat(inputs[1].value) || 0,
            remarks: inputs[2].value.trim()
          });
        }
      });

      if (items.length === 0) {
        showToast('Please add at least one item description.', 'error');
        return;
      }

      // Gather Reason
      const reasonTextarea = form.querySelector('textarea');
      const reasonForRequirement = reasonTextarea ? reasonTextarea.value.trim() : '';

      // Gather Approval details
      const approvalCards = form.querySelectorAll('.approval-card');
      
      // Prepared By
      const prepInputs = approvalCards[0].querySelectorAll('input');
      const preparedByName = prepInputs[0] ? prepInputs[0].value.trim() : '';
      const preparedBySig = prepInputs[1] ? prepInputs[1].value.trim() : '';
      const preparedByDate = prepInputs[2] ? prepInputs[2].value : '';

      // Verified By
      const verInputs = approvalCards[1].querySelectorAll('input');
      const verifiedByName = verInputs[0] ? verInputs[0].value.trim() : '';
      const verifiedBySig = verInputs[1] ? verInputs[1].value.trim() : '';
      const verifiedByDate = verInputs[2] ? verInputs[2].value : '';

      // Approved By
      const appInputs = approvalCards[2].querySelectorAll('input');
      const approvedByName = appInputs[0] ? appInputs[0].value.trim() : '';
      const approvedBySig = appInputs[1] ? appInputs[1].value.trim() : '';
      const approvedByDate = appInputs[2] ? appInputs[2].value : '';

      const payload = {
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
        items
      };

      const saveBtn = form.querySelector('.save-btn');
      const originalText = saveBtn.innerText;
      saveBtn.disabled = true;
      saveBtn.innerText = 'Submitting Indent...';

      try {
        const response = await fetch(`${API_BASE}/indents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showToast('Indent request submitted successfully!', 'success');
          savedIndentId = data.indentId;

          // Enable PDF actions
          if (downloadBtn) downloadBtn.style.display = 'inline-block';
          if (printBtn) printBtn.style.display = 'inline-block';

          saveBtn.innerText = 'Submitted ✓';
        } else {
          showToast(data.message || 'Error submitting indent.', 'error');
          saveBtn.disabled = false;
          saveBtn.innerText = originalText;
        }
      } catch (error) {
        console.error('Indent submission error:', error);
        showToast('Server connection failed.', 'error');
        saveBtn.disabled = false;
        saveBtn.innerText = originalText;
      }
    });

    // Reset handler
    form.addEventListener('reset', () => {
      savedIndentId = null;
      if (downloadBtn) downloadBtn.style.display = 'none';
      if (printBtn) printBtn.style.display = 'none';
      const saveBtn = form.querySelector('.save-btn');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerText = 'Submit Indent';
      }
    });
  }
});
