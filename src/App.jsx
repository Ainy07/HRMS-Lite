import { useState, useEffect } from "react";
import { api } from "./api";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EmployeeList from "./components/EmployeeList";
import AttendanceTracker from "./components/AttendanceTracker";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const refreshEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  useEffect(() => {
    refreshEmployees();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === "dashboard"  && <Dashboard employees={employees} />}
        {activeTab === "employees"  && <EmployeeList employees={employees} onRefresh={refreshEmployees} />}
        {activeTab === "attendance" && <AttendanceTracker employees={employees} />}
      </main>
    </div>
  );
}
