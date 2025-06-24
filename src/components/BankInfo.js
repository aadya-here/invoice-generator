export default function BankInfo({ form, handleChange }) {
  return (
    <div className="form-card">
      <h3 className="section-title">Bank Details</h3>
      <div className="input-group">
        <label>Account Holder Name</label>
        <input name="bankname" value={form.bankname} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Bank Name</label>
        <input name="bank" value={form.bank} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Branch</label>
        <input name="branch" value={form.branch} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Account Number</label>
        <input name="accountNumber" value={form.accountNumber} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>IFSC Code</label>
        <input name="ifsc" value={form.ifsc} onChange={handleChange} />
      </div>
    </div>
  );
}
