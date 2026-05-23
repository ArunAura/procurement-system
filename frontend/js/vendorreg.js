// Vendor Registration Page Integration

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const buttonGroup = document.querySelector('.button-group');
  
  let savedVendorId = null;

  // 1. Create and insert Download and Print buttons dynamically if they don't exist
  let printBtn = document.querySelector('.print-btn');
  let downloadBtn = document.querySelector('.download-btn');

  if (!printBtn) {
    printBtn = document.createElement('button');
    printBtn.type = 'button';
    printBtn.className = 'print-btn';
    printBtn.innerText = 'Print Record';
    printBtn.style.backgroundColor = '#4a5568';
    printBtn.style.color = 'white';
    printBtn.style.padding = '10px 20px';
    printBtn.style.border = 'none';
    printBtn.style.borderRadius = '6px';
    printBtn.style.cursor = 'pointer';
    printBtn.style.marginRight = '10px';
    printBtn.style.fontWeight = '600';
    printBtn.style.display = 'none'; // Hidden initially
    
    // Add print action
    printBtn.addEventListener('click', () => {
      if (savedVendorId) {
        window.open(`${API_BASE}/pdf/vendor/${savedVendorId}?action=print`, '_blank');
      }
    });

    // Insert into button group
    buttonGroup.insertBefore(printBtn, buttonGroup.querySelector('.save-btn'));
  }

  if (!downloadBtn) {
    downloadBtn = document.createElement('button');
    downloadBtn.type = 'button';
    downloadBtn.className = 'download-btn';
    downloadBtn.innerText = 'Download PDF';
    downloadBtn.style.backgroundColor = '#3182ce';
    downloadBtn.style.color = 'white';
    downloadBtn.style.padding = '10px 20px';
    downloadBtn.style.border = 'none';
    downloadBtn.style.borderRadius = '6px';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.style.marginRight = '10px';
    downloadBtn.style.fontWeight = '600';
    downloadBtn.style.display = 'none'; // Hidden initially
    
    // Add download action
    downloadBtn.addEventListener('click', () => {
      if (savedVendorId) {
        window.open(`${API_BASE}/pdf/vendor/${savedVendorId}?action=download`, '_blank');
      }
    });

    buttonGroup.insertBefore(downloadBtn, buttonGroup.querySelector('.save-btn'));
  }

  // 2. Handle form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Gather input elements
      const companyNameInput = form.querySelector('input[placeholder="Enter company name"]');
      const vendorTypeSelect = form.querySelector('select');
      const addressTextarea = form.querySelector('textarea[placeholder="Enter address"]');
      const gstInput = form.querySelector('input[placeholder="Enter GST Number"]');
      const panInput = form.querySelector('input[placeholder="Enter PAN Number"]');
      
      const contactPersonInput = form.querySelector('input[placeholder="Enter Name"]');
      const phoneInput = form.querySelector('input[placeholder="Enter Phone Number"]');
      const emailInput = form.querySelector('input[placeholder="Enter Email"]');
      const websiteInput = form.querySelector('input[placeholder="Company Website"]');
      
      const bankNameInput = form.querySelector('input[placeholder="Bank Name"]');
      const accountInput = form.querySelector('input[placeholder="Account Number"]');
      const ifscInput = form.querySelector('input[placeholder="IFSC Code"]');
      const branchInput = form.querySelector('input[placeholder="Branch Name"]');
      
      const productInput = form.querySelector('input[placeholder="Enter Product Category"]');
      const timelineInput = form.querySelector('input[placeholder="Delivery Timeline"]');
      // Second select is Payment Terms
      const selectElements = form.querySelectorAll('select');
      const paymentTermsSelect = selectElements.length > 1 ? selectElements[1] : null;

      // Documents checkboxes
      const documentCheckboxes = form.querySelectorAll('.document-grid input[type="checkbox"]');
      const selectedDocs = [];
      documentCheckboxes.forEach(cb => {
        if (cb.checked) {
          // Label text is adjacent to the checkbox
          selectedDocs.push(cb.parentElement.innerText.trim());
        }
      });

      // Validations
      if (!companyNameInput || !companyNameInput.value.trim()) {
        showToast('Company Name is required', 'error');
        return;
      }

      const payload = {
        companyName: companyNameInput.value.trim(),
        vendorType: vendorTypeSelect ? vendorTypeSelect.value : '',
        address: addressTextarea ? addressTextarea.value.trim() : '',
        gstNumber: gstInput ? gstInput.value.trim() : '',
        panNumber: panInput ? panInput.value.trim() : '',
        contactPerson: contactPersonInput ? contactPersonInput.value.trim() : '',
        phoneNumber: phoneInput ? phoneInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        website: websiteInput ? websiteInput.value.trim() : '',
        bankName: bankNameInput ? bankNameInput.value.trim() : '',
        accountNumber: accountInput ? accountInput.value.trim() : '',
        ifscCode: ifscInput ? ifscInput.value.trim() : '',
        branchName: branchInput ? branchInput.value.trim() : '',
        productsServices: productInput ? productInput.value.trim() : '',
        deliveryTimeline: timelineInput ? timelineInput.value.trim() : '',
        paymentTerms: paymentTermsSelect ? paymentTermsSelect.value : '',
        documents: selectedDocs
      };

      // Disable Save button during submission
      const saveBtn = form.querySelector('.save-btn');
      const originalText = saveBtn.innerText;
      saveBtn.disabled = true;
      saveBtn.innerText = 'Saving Vendor...';

      try {
        const response = await fetch(`${API_BASE}/vendors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showToast('Vendor registration saved successfully!', 'success');
          savedVendorId = data.vendorId;

          // Make Print & Download buttons visible
          printBtn.style.display = 'inline-block';
          downloadBtn.style.display = 'inline-block';

          // Reset button text
          saveBtn.innerText = 'Saved ✓';
        } else {
          showToast(data.message || 'Error saving vendor registration.', 'error');
          saveBtn.disabled = false;
          saveBtn.innerText = originalText;
        }
      } catch (error) {
        console.error('Save vendor error:', error);
        showToast('Connection to server failed.', 'error');
        saveBtn.disabled = false;
        saveBtn.innerText = originalText;
      }
    });

    // Reset button should also hide Print/Download buttons and clear saved vendor id
    form.addEventListener('reset', () => {
      savedVendorId = null;
      printBtn.style.display = 'none';
      downloadBtn.style.display = 'none';
      const saveBtn = form.querySelector('.save-btn');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerText = 'Save Vendor';
      }
    });
  }
});
