import { useState, useEffect } from "react";
import { api } from "../api";
import AttendanceChart from "./AttendanceChart";

const TODAY = new Date().toLocaleDateString("en-CA");

function StatusBadge({ status }) {
  const cls = `badge badge-${status.toLowerCase()}`;
  return (
    <span className={cls}>
      <span className="badge-dot" />
      {status}
    </span>
  );
}

export default function AttendanceTracker({ employees }) {
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [attendance, setAttendance]       = useState([]);
  const [attForm, setAttForm]             = useState({ date: TODAY, status: "Present" });
  const [loading, setLoading]             = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [submitError, setSubmitError]     = useState("");

  useEffect(() => {
    if (!selectedEmpId) {
      setAttendance([]);
      return;
    }
    setLoading(true);
    api.get(`/employees/${selectedEmpId}/attendance`)
      .then((r) => setAttendance(r.data))
      .catch(() => setAttendance([]))
      .finally(() => setLoading(false));
  }, [selectedEmpId]);

  const handleMark = async () => {
    if (!selectedEmpId) return;
    if (!attForm.date) {
      setSubmitError("Date is required.");
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      await api.post(`/employees/${selectedEmpId}/attendance`, attForm);
      const r = await api.get(`/employees/${selectedEmpId}/attendance`);
      setAttendance(r.data);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to record attendance.";
      setSubmitError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedEmp = employees.find((e) => e.id === selectedEmpId);

  return (
    <div style={{ animation: "fadeInUp 0.35s ease" }}>
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track daily attendance records for your team</p>
      </div>

      <div className="attendance-layout">
        {/* Left Panel — Mark Attendance */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Mark Attendance</span>
          </div>
          <div className="card-body">
            <div className="attendance-form-fields">
              <div className="form-group">
                <label className="form-label">Employee</label>
                <select
                  className="select"
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                >
                  <option value="">— Select employee —</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} · {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  className="input"
                  type="date"
                  value={attForm.date}
                  onChange={(e) => setAttForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="select"
                  value={attForm.status}
                  onChange={(e) => setAttForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>

              {submitError && <div className="form-error">{submitError}</div>}

              <button
                className="btn btn-primary"
                onClick={handleMark}
                disabled={!selectedEmpId || submitting}
                style={{ width: "100%", justifyContent: "center", marginTop: "0.25rem" }}
              >
                {submitting ? "Saving…" : "Mark Attendance"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel — History */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              {selectedEmp ? `${selectedEmp.full_name} — History` : "Attendance History"}
            </span>
            {attendance.length > 0 && (
              <span className="count-badge">{attendance.length} records</span>
            )}
          </div>

          {!selectedEmpId ? (
            <div className="attendance-empty">
              <div className="attendance-empty-icon">📅</div>
              <div style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>
                Select an employee
              </div>
              <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                Choose an employee to view their attendance history
              </div>
            </div>
          ) : loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : (
            <>
              <AttendanceChart records={attendance} />
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.length === 0 ? (
                      <tr>
                        <td colSpan={3}>
                          <div className="table-empty">
                            <div className="table-empty-title">No records yet</div>
                            <div>Mark attendance using the form to get started</div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      [...attendance]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((rec) => (
                          <tr key={rec.id}>
                            <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{rec.date}</td>
                            <td style={{ color: "var(--color-text-secondary)" }}>
                              {new Date(rec.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                            </td>
                            <td><StatusBadge status={rec.status} /></td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
