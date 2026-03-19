import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { api } from "../api";
import StatCard from "./StatCard";

function getLast14Days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toLocaleDateString("en-CA");
  });
}

const TOOLTIP_STYLE = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  color: "#0f172a",
  fontSize: "0.8rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

export default function Dashboard({ employees }) {
  const [allAttendanceMap, setAllAttendanceMap] = useState({});
  const [loadingCharts, setLoadingCharts] = useState(false);

  useEffect(() => {
    if (employees.length === 0) return;
    setLoadingCharts(true);
    Promise.all(
      employees.map((emp) =>
        api
          .get(`/employees/${emp.id}/attendance`)
          .then((r) => ({ id: emp.id, name: emp.full_name, records: r.data }))
          .catch(() => ({ id: emp.id, name: emp.full_name, records: [] }))
      )
    ).then((results) => {
      const map = {};
      results.forEach(({ id, name, records }) => { map[id] = { name, records }; });
      setAllAttendanceMap(map);
      setLoadingCharts(false);
    });
  }, [employees]);

  const allRecords = Object.values(allAttendanceMap).flatMap((e) => e.records);

  // Overall stats
  const totalRecords  = allRecords.length;
  const presentCount  = allRecords.filter((r) => r.status === "Present").length;
  const absentCount   = allRecords.filter((r) => r.status === "Absent").length;
  const leaveCount    = allRecords.filter((r) => r.status === "Leave").length;
  const overallRate   = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  // Most active employee (most records)
  let mostActiveLabel = "—";
  let mostActiveCount = 0;
  Object.values(allAttendanceMap).forEach(({ name, records }) => {
    if (records.length > mostActiveCount) {
      mostActiveCount = records.length;
      mostActiveLabel = name;
    }
  });

  // Last 14 days bar chart
  const last14 = getLast14Days();
  const barData = last14.map((dateStr) => ({
    day: new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Present: allRecords.filter((r) => r.date === dateStr && r.status === "Present").length,
    Absent:  allRecords.filter((r) => r.date === dateStr && r.status === "Absent").length,
    Leave:   allRecords.filter((r) => r.date === dateStr && r.status === "Leave").length,
  }));

  // All-time pie breakdown
  const pieData = [
    { name: "Present", value: presentCount },
    { name: "Absent",  value: absentCount },
    { name: "Leave",   value: leaveCount },
  ].filter((d) => d.value > 0);
  const PIE_COLORS = ["#2563eb", "#dc2626", "#d97706"];

  return (
    <div style={{ animation: "fadeInUp 0.35s ease" }}>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overall workforce snapshot — all-time data</p>
      </div>

      <div className="stat-cards-grid">
        <StatCard
          label="Total Employees"
          value={employees.length}
          accentColor="var(--color-accent)"
          accentGlow="var(--color-accent-glow)"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
        />
        <StatCard
          label="Overall Attendance Rate"
          value={`${overallRate}%`}
          accentColor="var(--color-accent)"
          accentGlow="var(--color-accent-glow)"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          }
        />
        <StatCard
          label="Total Records Logged"
          value={totalRecords}
          accentColor="var(--color-accent-alt)"
          accentGlow="rgba(79, 70, 229, 0.08)"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          }
        />
        <StatCard
          label="Total Present"
          value={presentCount}
          accentColor="#2563eb"
          accentGlow="rgba(37, 99, 235, 0.08)"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          }
        />
        <StatCard
          label="Total Absent"
          value={absentCount}
          accentColor="#dc2626"
          accentGlow="rgba(220, 38, 38, 0.08)"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          }
        />
        <StatCard
          label="Most Active Employee"
          value={mostActiveCount > 0 ? mostActiveLabel.split(" ")[0] : "—"}
          accentColor="var(--color-accent-alt)"
          accentGlow="rgba(79, 70, 229, 0.08)"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          }
        />
      </div>

      <div className="charts-grid">
        {/* Bar Chart — last 14 days */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Attendance — Last 14 Days</span>
          </div>
          <div className="card-body">
            {loadingCharts ? (
              <div className="loading-state"><div className="spinner" /></div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barCategoryGap="35%">
                  <XAxis dataKey="day" stroke="transparent" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(37,99,235,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: "0.8rem", color: "#475569" }} />
                  <Bar dataKey="Present" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Absent"  fill="#dc2626" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Leave"   fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Donut Chart — all-time breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">All-Time Breakdown</span>
          </div>
          <div className="card-body">
            {loadingCharts ? (
              <div className="loading-state"><div className="spinner" /></div>
            ) : pieData.length === 0 ? (
              <div className="loading-state" style={{ padding: "2.5rem" }}>
                <span style={{ fontSize: "2rem" }}>📊</span>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>No attendance recorded yet</span>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={88}
                      dataKey="value"
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: "0.8rem", color: "#475569" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: "absolute",
                  top: "42%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  pointerEvents: "none",
                }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2563eb", lineHeight: 1 }}>
                    {overallRate}%
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 500, marginTop: "0.2rem" }}>
                    Present
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
