export default function UploadSection({ handleChange }) {
  return (
    <div className="form-card">
      <h3 className="section-title">Uploads</h3>
      <div className="input-group">
        <label>Signature</label>
        <input name="signature" type="file" accept="image/*" onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Cancelled Cheque (Preffered)/ Passbook</label>
        <input name="cheque" type="file" accept="image/*" onChange={handleChange} />
      </div>
    </div>
  );
}
