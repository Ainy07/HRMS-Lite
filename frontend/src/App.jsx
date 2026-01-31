import { useEffect, useState } from "react";
import { api } from "./api";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const [empForm, setEmpForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: ""
  });

  const [attForm, setAttForm] = useState({
    date: "",
    status: "Present"
  });

  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  const fetchAttendance = async (empId) => {
    setLoading(true);
    const res = await api.get(`/employees/${empId}/attendance`);
    setAttendance(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async () => {
    if (!Object.values(empForm).every(Boolean)) {
      alert("All employee fields are required");
      return;
    }
    await api.post("/employees", empForm);
    setEmpForm({ employee_id:"", full_name:"", email:"", department:"" });
    fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    await api.delete(`/employees/${id}`);
    setSelectedEmp(null);
    fetchEmployees();
  };

  const markAttendance = async () => {
    if (!attForm.date) {
      alert("Date required");
      return;
    }
    await api.post(`/employees/${selectedEmp.id}/attendance`, attForm);
    fetchAttendance(selectedEmp.id);
  };

  return (
    <div className="container">
      <h1>HRMS Lite</h1>

      {/* EMPLOYEE SECTION */}
      <div className="card">
        <h2>Add Employee</h2>
        <input placeholder="Employee ID" value={empForm.employee_id}
          onChange={e=>setEmpForm({...empForm,employee_id:e.target.value})}/>
        <input placeholder="Full Name" value={empForm.full_name}
          onChange={e=>setEmpForm({...empForm,full_name:e.target.value})}/>
        <input placeholder="Email" value={empForm.email}
          onChange={e=>setEmpForm({...empForm,email:e.target.value})}/>
        <input placeholder="Department" value={empForm.department}
          onChange={e=>setEmpForm({...empForm,department:e.target.value})}/>
        <button onClick={addEmployee}>Add Employee</button>
      </div>

      <div className="card">
        <h2>Employees</h2>
        {employees.length === 0 && <p>No employees</p>}
        {employees.map(emp => (
          <div key={emp.id} className="row">
            <span onClick={() => {
              setSelectedEmp(emp);
              fetchAttendance(emp.id);
            }} className="link">
              {emp.full_name} ({emp.department})
            </span>
            <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* ATTENDANCE SECTION */}
      {selectedEmp && (
        <div className="card">
          <h2>Attendance – {selectedEmp.full_name}</h2>

          <input type="date"
            value={attForm.date}
            onChange={e=>setAttForm({...attForm,date:e.target.value})}/>

          <select
            value={attForm.status}
            onChange={e=>setAttForm({...attForm,status:e.target.value})}>
            <option>Present</option>
            <option>Absent</option>
          </select>

          <button onClick={markAttendance}>Mark Attendance</button>

          <h3>Records</h3>
          {loading && <p>Loading...</p>}
          {attendance.length === 0 && <p>No records</p>}

          {attendance.map(a => (
            <div key={a.id} className="row">
              <span>{a.date}</span>
              <strong>{a.status}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
