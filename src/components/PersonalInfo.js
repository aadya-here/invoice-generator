export default function PersonalInfo({ form, handleChange }) {
  return (
    
    <div className="form-card">

      <div className="input-group">
        <label>Company</label>
        <select name="company" value={form.company} onChange={handleChange}>
          <option value="">Select</option>
          <option value="mCaffeine">mCaffeine</option>
          <option value="Hyphen">Hyphen</option>
        </select>
      </div>
      
      <h3 className="section-title">Personal Information</h3>
      <div className="input-group">
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Address</label>
        <input name="address" value={form.address} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>PAN Number</label>
        <input name="pan" value={form.pan} onChange={handleChange} />
      </div>
      
      <div className="input-group">
        <label>Amount</label>
        <input name="amount" value={form.amount} onChange={handleChange} />
      </div>

      <div className="input-group">
        <label>Product</label>
        <input name="product" value={form.product} onChange={handleChange} />
      </div>
    </div>
  );
}
