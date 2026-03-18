import { useEffect, useState } from "react";
import { api } from "./api";

export default function App() {

  const [activeTab, setActiveTab] = useState("dashboard");

  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [attendance, setAttendance] = useState([]); // single employee
  const [allAttendance, setAllAttendance] = useState([]); // 🔥 global

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

  // 🔹 FETCH EMPLOYEES
  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);

    // 🔥 fetch all attendance after employees load
    fetchAllAttendance(res.data);
  };

  // 🔹 FETCH SINGLE EMPLOYEE
  const fetchAttendance = async (empId) => {
    setLoading(true);
    const res = await api.get(`/employees/${empId}/attendance`);
    setAttendance(res.data);
    setLoading(false);
  };

  // 🔥 GLOBAL ATTENDANCE (NO BACKEND CHANGE)
  const fetchAllAttendance = async (emps) => {
    try {
      const requests = emps.map(emp =>
        api.get(`/employees/${emp.id}/attendance`)
      );

      const responses = await Promise.all(requests);

      const allData = responses.flatMap((res, index) =>
        res.data.map(a => ({
          ...a,
          employee: emps[index].full_name
        }))
      );

      setAllAttendance(allData);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🔹 ADD EMPLOYEE
  const addEmployee = async () => {
    if (!Object.values(empForm).every(Boolean)) {
      alert("All employee fields are required");
      return;
    }

    await api.post("/employees", empForm);

    setEmpForm({
      employee_id: "",
      full_name: "",
      email: "",
      department: ""
    });

    fetchEmployees(); // 🔥 refresh all
  };

  // 🔹 DELETE EMPLOYEE
  const deleteEmployee = async (id) => {
    await api.delete(`/employees/${id}`);
    setSelectedEmp(null);
    fetchEmployees();
  };

  // 🔹 MARK ATTENDANCE
  const markAttendance = async () => {
    if (!attForm.date) {
      alert("Date required");
      return;
    }

    await api.post(`/employees/${selectedEmp.id}/attendance`, attForm);

    fetchAttendance(selectedEmp.id);
    fetchAllAttendance(employees); // 🔥 update dashboard
  };

  // 🔥 GLOBAL CALCULATIONS
  const presentCount = allAttendance.filter(a => a.status === "Present").length;
  const absentCount = allAttendance.filter(a => a.status === "Absent").length;

  const totalAttendance = allAttendance.length;

  const percent = totalAttendance
    ? Math.round((presentCount / totalAttendance) * 100)
    : 0;

  const last7Days = allAttendance.slice(-7);

  const deptData = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>HRMS</h2>
        <ul>
          <li className={activeTab==="dashboard"?"active":""}
              onClick={()=>setActiveTab("dashboard")}>Dashboard</li>
          <li className={activeTab==="employees"?"active":""}
              onClick={()=>setActiveTab("employees")}>Employees</li>
          <li className={activeTab==="attendance"?"active":""}
              onClick={()=>setActiveTab("attendance")}>Attendance</li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main">

        <div className="header">
          <h1>{activeTab.toUpperCase()}</h1>
        </div>

        {/* ================= DASHBOARD ================= */}
        {activeTab === "dashboard" && (
          <div className="sales-dashboard">

            {/* TOP */}
            <div className="top-cards">
              <div className="dash-card"><p>Employees</p><h2>{employees.length}</h2></div>
              <div className="dash-card"><p>Present</p><h2>{presentCount}</h2></div>
              <div className="dash-card"><p>Absent</p><h2>{absentCount}</h2></div>
              <div className="dash-card"><p>Attendance %</p><h2>{percent}%</h2></div>
            </div>

            {/* MIDDLE */}
            <div className="middle-section">

              <div className="card chart-card">
                <h3>Attendance Distribution</h3>
                <div className="pie-wrapper">
                  <div
                    className="pie-chart"
                    style={{
                      background: `conic-gradient(#2ecc71 ${percent}%, #e74c3c 0)`
                    }}
                  >
                    <span>{percent}%</span>
                  </div>
                </div>
              </div>

              <div className="card chart-card">
                <h3>Last 7 Days Attendance</h3>

                <div className="line-chart">
                  <svg viewBox="0 0 300 150" className="line-svg">
                    <polyline
                      fill="none"
                      stroke="#4facfe"
                      strokeWidth="2"
                      points={last7Days.map((a, i) => {
                        const x = (i / (last7Days.length - 1 || 1)) * 280 + 10;
                        const y = a.status === "Present" ? 30 : 120;
                        return `${x},${y}`;
                      }).join(" ")}
                    />
                  </svg>

                  {last7Days.map((a, i) => {
                    const x = (i / (last7Days.length - 1 || 1)) * 280 + 10;
                    const y = a.status === "Present" ? 30 : 120;

                    return (
                      <div
                        key={i}
                        className="point-wrapper"
                        style={{
                          left: `${(x / 300) * 100}%`,
                          top: `${(y / 150) * 100}%`
                        }}
                      >
                        <div className={a.status==="Present"?"point green-point":"point red-point"}></div>
                        <div className="tooltip">
                          <p>{a.date}</p>
                          <strong>{a.status}</strong>
                        </div>
                      </div>
                    );
                  })}

                  <div className="x-axis">
                    {last7Days.map((a,i)=>(
                      <span key={i}>{new Date(a.date).getDate()}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* BOTTOM */}
            <div className="bottom-section">

              <div className="card bar-card">
                <h3>Department Distribution</h3>
                <div className="bars">
                  {Object.keys(deptData).map((dept,i)=>{
                    const value = deptData[dept];
                    const percentDept = Math.round((value / employees.length) * 100);
                    return (
                      <div key={i} className="bar">
                        <span>{dept} ({value})</span>
                        <div className="progress">
                          <div style={{width:`${percentDept}%`}}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card bar-card">
                <h3>Attendance Overview</h3>
                <div className="bars">
                  <div className="bar">
                    <span>Present ({presentCount})</span>
                    <div className="progress">
                      <div style={{width:`${percent}%`}}></div>
                    </div>
                  </div>

                  <div className="bar">
                    <span>Absent ({absentCount})</span>
                    <div className="progress">
                      <div style={{width:`${100-percent}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= EMPLOYEES (UNCHANGED) ================= */}
        {activeTab === "employees" && (
          <div className="card">
            <h2>Add Employee</h2>

            <div className="grid">
              <input placeholder="Employee ID" value={empForm.employee_id}
                onChange={e=>setEmpForm({...empForm,employee_id:e.target.value})}/>
              <input placeholder="Full Name" value={empForm.full_name}
                onChange={e=>setEmpForm({...empForm,full_name:e.target.value})}/>
              <input placeholder="Email" value={empForm.email}
                onChange={e=>setEmpForm({...empForm,email:e.target.value})}/>
              <input placeholder="Department" value={empForm.department}
                onChange={e=>setEmpForm({...empForm,department:e.target.value})}/>
            </div>

            <button className="primary-btn" onClick={addEmployee}>
              Add Employee
            </button>

            {employees.map(emp => (
              <div key={emp.id} className="row modern">
                <div>
                  <strong>{emp.full_name}</strong>
                  <p>{emp.department}</p>
                </div>
                <button className="delete-btn" onClick={() => deleteEmployee(emp.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= ATTENDANCE (UNCHANGED) ================= */}
        {activeTab === "attendance" && (
          <div className="attendance-layout">

            <div className="emp-list card">
              <h3>Employees</h3>
              {employees.map(emp=>(
                <div key={emp.id}
                  className={`emp-item ${selectedEmp?.id===emp.id?"active":""}`}
                  onClick={()=>{
                    setSelectedEmp(emp);
                    fetchAttendance(emp.id);
                  }}>
                  {emp.full_name}
                </div>
              ))}
            </div>

            <div className="attendance-panel card">
              {!selectedEmp ? (
                <div className="empty-state">Select Employee</div>
              ) : (
                <>
                  <h2>{selectedEmp.full_name}</h2>

                  <div className="grid">
                    <input type="date"
                      value={attForm.date}
                      onChange={e=>setAttForm({...attForm,date:e.target.value})}/>
                    <select
                      value={attForm.status}
                      onChange={e=>setAttForm({...attForm,status:e.target.value})}>
                      <option>Present</option>
                      <option>Absent</option>
                    </select>
                  </div>

                  <button className="primary-btn" onClick={markAttendance}>
                    Mark Attendance
                  </button>

                  {attendance.map(a=>(
                    <div key={a.id} className="record">
                      <span>{a.date}</span>
                      <span className={a.status==="Present"?"green":"red"}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}