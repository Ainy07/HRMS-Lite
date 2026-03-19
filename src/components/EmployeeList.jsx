import { useState } from "react";
import { api } from "../api";
import AddEmployeeModal from "./AddEmployeeModal";

const EMPTY_FORM = { employee_id: "", full_name: "", email: "", department: "" };

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function EmployeeList({ employees, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [empForm, setEmpForm]         = useState(EMPTY_FORM);
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState("");

  const filtered = employees.filter((emp) => {
    const q = searchQuery.toLowerCase();
    return (
      emp.full_name.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.employee_id.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q)
    );
  });

  const handleAddEmployee = async () => {
    if (!Object.values(empForm).every(Boolean)) {
      setFormError("All fields are required.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      await api.post("/employees", empForm);
      setEmpForm(EMPTY_FORM);
      setShowModal(false);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to add employee.";
      setFormError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      onRefresh();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEmpForm(EMPTY_FORM);
    setFormError("");
  };

  return (
    <div style={{ animation: "fadeInUp 0.35s ease" }}>
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <p className="page-subtitle">Manage your workforce — add, search, and remove employees</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="section-row-left">
            <span className="card-title">All Employees</span>
            <span className="count-badge">{employees.length}</span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <div className="search-bar">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="input"
                placeholder="Search employees…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Employee
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="table-empty">
                      <div className="table-empty-title">
                        {searchQuery ? "No employees match your search" : "No employees yet"}
                      </div>
                      <div>{searchQuery ? "Try a different keyword" : "Add your first employee to get started"}</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="emp-cell">
                        <div className="emp-avatar">{getInitials(emp.full_name)}</div>
                        <div>
                          <div className="emp-name">{emp.full_name}</div>
                          <div className="emp-id">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "var(--color-text-secondary)", fontFamily: "monospace", fontSize: "0.8rem" }}>
                      {emp.employee_id}
                    </td>
                    <td><span className="dept-tag">{emp.department}</span></td>
                    <td style={{ color: "var(--color-text-secondary)" }}>{emp.email}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddEmployeeModal
          onClose={closeModal}
          onSubmit={handleAddEmployee}
          form={empForm}
          setForm={setEmpForm}
          submitting={submitting}
          error={formError}
        />
      )}
    </div>
  );
}
