export default function AddEmployeeModal({ onClose, onSubmit, form, setForm, submitting, error }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Add New Employee</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">Employee ID</label>
            <input
              className="input"
              placeholder="e.g. EMP-001"
              value={form.employee_id}
              onChange={handleChange("employee_id")}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="input"
              placeholder="e.g. Jane Smith"
              value={form.full_name}
              onChange={handleChange("full_name")}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="e.g. jane@company.com"
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              className="input"
              placeholder="e.g. Engineering"
              value={form.department}
              onChange={handleChange("department")}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onSubmit} disabled={submitting}>
              {submitting ? "Adding…" : "Add Employee"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
