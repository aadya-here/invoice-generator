import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import PersonalInfo from './components/PersonalInfo';
import BankInfo from './components/BankInfo';
import UploadSection from './components/UploadSection';
import './App.css';

export default function InvoiceGenerator() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    pan: '',
    amount: '',
    product: '',
    accountNumber: '',
    bankname: '',
    branch: '',
    bank: '',
    ifsc: '',
    company: '',
    signature: null,
    cheque: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'signature' || name === 'cheque') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm((prev) => ({ ...prev, [name]: e.target.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };


     
  const generateInvoiceNumber = async (sheetName) => {
    try {
      // Replace with logic to fetch last invoice number from Sheets if needed
      return `INV-${Date.now().toString().slice(-6)}`;
    } catch (err) {
      console.error('Invoice generation failed:', err);
      return `INV-${Date.now().toString().slice(-6)}`;
    }
  };

  const generatePDF = async () => {
    const requiredFields = [
      'name', 'address', 'pan', 'amount', 'product', 'accountNumber',
      'bankname', 'branch', 'bank', 'ifsc', 'company', 'signature', 'cheque'
    ];

    const missing = requiredFields.filter((key) => !form[key]);
    if (missing.length > 0) {
      alert(`Please fill in:\n${missing.join('\n')}`);
      return;
    }

    
    try {
      const sheetName = form.company === 'mCaffeine' ? 'mCaffeine' : 'Hyphen';
      const invoiceNumber = await generateInvoiceNumber(sheetName);

      const companyDetails = {
        mCaffeine: {
          name: 'PEP TECHNOLOGIES PRIVATE LIMITED',
          address: '3RD FLOOR, A1 304, Kanakia Boomerang,\nChandivali Road,\nYadav Nagar, Mumbai Suburban, Maharashtra, 400072',
          gst: '27AAICP2804J2ZB',
          pan: 'AAICP2804J',
        },
        Hyphen: {
          name: 'KREATIVE BEAUTY PRIVATE LIMITED',
          address: '4TH FLOOR, B1 401, Kanakia Boomerang,\nChandivali Road,\nYadav Nagar, Mumbai Suburban, Maharashtra, 400072',
          gst: '27AAJCK9697FIZS',
          pan: 'AAFCT6601C',
        },
      };

      const doc = new jsPDF();
      let y = 25;

      doc.setFont(undefined, 'bold');
      doc.text('INVOICE FOR SERVICES PROVIDED', 55, y);
      y += 15;

      doc.setFont(undefined, 'normal');
      doc.setFontSize(12);
      doc.text(`Name: ${form.name}`, 20, y);
      doc.text(`Address: ${form.address}`, 20, y + 8);
      doc.text(`PAN No: ${form.pan}`, 20, y + 16);
      doc.text(`Invoice Number: ${invoiceNumber}`, 120, y);
      doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 120, y + 10);

      y += 40;
      const company = companyDetails[form.company];
      doc.text(`To`, 20, y);
      y += 8;
      doc.text(company.name, 20, y);
      y += 8;
      doc.text(doc.splitTextToSize(company.address, 180), 20, y);
      y += 20;
      doc.text(`GST: ${company.gst}`, 20, y);
      doc.text(`PAN: ${company.pan}`, 20, y + 6);

      y += 20;
      autoTable(doc, {
        startY: y,
        head: [['S. No.', 'Service Description', 'Units/Posts (Nos.)', 'Rate (Rs.)', 'Amount (Rs.)']],
        body: [['1', 'Reel', '1', form.amount, form.amount]],
        styles: { fontSize: 10 },
        theme: 'grid',
      });

      const formatINR = (num) => Number(num).toLocaleString('en-IN');
      const tableY = doc.lastAutoTable.finalY + 10;
      doc.text(`Total Amount to be paid: INR ${formatINR(form.amount)}`, 70, tableY);

      let y2 = tableY + 20;
      doc.setFont(undefined, 'bold');
      doc.text(`Service Provider Details:`, 20, y2);
      y2 += 6;
      doc.setFont(undefined, 'normal');
      doc.text(`Service Description: Content creation for ${form.product}`, 20, y2);

      y2 += 14;
      doc.setFont(undefined, 'bold');
      doc.text(`Banking Details:`, 20, y2);
      doc.setFont(undefined, 'normal');
      doc.text(`Account Holder Name: ${form.bankname}`, 20, y2 + 6);
      doc.text(`Bank Name: ${form.bank}`, 20, y2 + 12);
      doc.text(`Bank Branch: ${form.branch}`, 20, y2 + 18);
      doc.text(`Account No.: ${form.accountNumber}`, 20, y2 + 24);
      doc.text(`IFSC Code: ${form.ifsc}`, 20, y2 + 30);

      if (form.signature) {
        doc.text(`Signature:`, 160, y2 + 30);
        doc.addImage(form.signature, 'PNG', 160, y2 + 35, 30, 20);
      }

      const savePDF = async () => {
        doc.save(`Invoice_${invoiceNumber}_${form.name}.pdf`);
        // await writeToSheet(invoiceNumber); 
      };

      if (form.cheque) {
        const img = new Image();
        img.src = form.cheque;
        img.onload = () => {
          const width = doc.internal.pageSize.getWidth() - 40;
          const height = (width * img.height) / img.width;

          doc.addPage();
          doc.setFontSize(14);
          doc.text('Attached Document (Cancelled Cheque / Passbook)', 20, 20);
          doc.addImage(img, 'PNG', 20, 30, width, height);

          savePDF();
        };
        img.onerror = () => {
          alert('⚠️ Failed to load cheque image. Saving PDF without attachment.');
          savePDF();
        };
      } else {
        savePDF();
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('❌ Failed to generate invoice.');
    }
  };

  return (
    <div className="invoice-generator-container">
      <h1 className="page-title">Invoice Generator for Creators</h1>
      <h2 className="page-subtitle">Partnered with mCaffeine & Hyphen</h2>
      <PersonalInfo form={form} handleChange={handleChange} />
      <BankInfo form={form} handleChange={handleChange} />
      <UploadSection handleChange={handleChange} />
      <div className="form-card generate-btn-card">
        <button onClick={generatePDF}>
          Generate Invoice
        </button>
      </div>
    </div>
  );
}
