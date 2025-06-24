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
    pan: '',
    amount: '',
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


  const generatePDF = () => {
const requiredFields = [
    'name',
    'pan',
    'amount',
    'accountNumber',
    'bankname',
    'branch',
    'bank',
    'ifsc',
    'company',
    'signature',
    'cheque'
  ];

  const missingFields = requiredFields.filter((field) => !form[field]);

  if (missingFields.length > 0) {
  alert(`Please fill the following missing fields:\n${missingFields.join('\n')}`);
  return;
}
    const companyDetails = {
      mCaffeine: {
        name: 'PEP TECHNOLOGIES PRIVATE LIMITED',
        address:
          '4TH FLOOR, B1 401, Kanakia Boomerang,\nChandivali Road,\nYadav Nagar, Mumbai Suburban, Maharashtra, 400072',
        gst: '27AAICP2804J2ZB',
      },
      Hyphen: {
        name: 'KREATIVE BEAUTY PRIVATE LIMITED',
        address:
          '1401, BUILDING NO. B1, BOOMERANG EQUITY BUSINESS PARK,\nCTS NO 4, CHANDIVALI FARM HOUSE, Sakinaka, Mumbai,\nMumbai Suburban, Maharashtra, 400072',
        gst: '27AAJCK9697F1ZS',
      },
    };

    const company = companyDetails[form.company];
    if (!company) {
      alert('Please select a valid company.');
      return;
    }

    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFontSize(12);
    doc.text(`Name: ${form.name}`, 20, y);
    doc.text(`PAN No: ${form.pan}`, 20, y + 10);
    doc.text(`Invoice Number: `, 120, y);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 120, y + 10);

    y += 40;
    doc.text(`To`, 20, y);
    y += 8;
    doc.text(company.name, 20, y);
    y += 8;
    doc.text(doc.splitTextToSize(company.address, 180), 20, y);
    y += 16;
    doc.text(`GST: ${company.gst}`, 20, y);

    y += 16;
    doc.setFont(undefined, 'bold');
    doc.text(`INVOICE FOR SERVICES PROVIDED`, 70, y);
    doc.setFont(undefined, 'normal');
    y += 10;

    // Table
    autoTable(doc, {
      startY: y,
      head: [['S. No.', 'Service Description', 'Units/Posts (Nos.)', 'Rate (Rs.)', 'Amount (Rs.)']],
      body: [['1', 'Reel', '1', form.amount, form.amount]],
      styles: { fontSize: 10 },
      theme: 'grid',
    });

    let tableY = doc.lastAutoTable.finalY + 2;
    const formatIndianNumber = (num) => Number(num).toLocaleString('en-IN');
    const formattedAmt = formatIndianNumber(form.amount);

    doc.setFont(undefined, 'bold');
    doc.text(`Total Amount to be paid: ₹${formattedAmt}`, 50, tableY + 30);
    doc.setFont(undefined, 'normal');

    // Service and Banking Details
    tableY += 40;
    doc.setFont(undefined, 'bold');
    doc.text(`Service Provider Details:`, 20, tableY);
    doc.setFont(undefined, 'normal');
    doc.text(`Service Description: Content creation for promotion`, 20, tableY + 6);

    tableY += 16;
    doc.setFont(undefined, 'bold');
    doc.text(`Banking Details:`, 20, tableY);
    doc.setFont(undefined, 'normal');
    doc.text(`Account Holder Name: ${form.bankname}`, 20, tableY + 6);
    doc.text(`Bank Name: ${form.bank}`, 20, tableY + 12);
    doc.text(`Bank Branch: ${form.branch}`, 20, tableY + 18);
    doc.text(`Account No.: ${form.accountNumber}`, 20, tableY + 24);
    doc.text(`IFSC Code: ${form.ifsc}`, 20, tableY + 30);

    // Signature
    if (form.signature) {
      doc.text(`Signature:`, 160, tableY + 30);
      doc.addImage(form.signature, 'PNG', 160, tableY + 35, 30, 20);
    }

    doc.save(`Invoice_${form.name || 'Influencer'}.pdf`);

        const savePDF = () => {
      doc.save(`Invoice_${form.name || 'Influencer'}.pdf`);
    };

    if (form.cheque) {
      const img = new Image();
      img.src = form.cheque;

      img.onload = () => {
        const imgWidth = doc.internal.pageSize.getWidth() - 40; // 20px margin
        const ratio = img.height / img.width;
        const imgHeight = imgWidth * ratio;

        doc.addPage();
        doc.setFontSize(14);
        doc.text('Attached Document (Cancelled Cheque / Passbook)', 20, 20);
        doc.addImage(img, 'PNG', 20, 30, imgWidth, imgHeight);

        savePDF(); // Now save after adding image
      };
    } else {
      savePDF(); // Save immediately if no cheque
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
      <button onClick={generatePDF}>Generate Invoice</button>
    </div>
  </div>
);

}


