import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const STATUS_COLOR = {
  Present: "var(--color-present)",
  Absent:  "var(--color-absent)",
  Leave:   "var(--color-leave)",
};

const TOOLTIP_STYLE = {
  background: "var(--color-bg-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  color: "var(--color-text-primary)",
  fontSize: "0.8rem",
};

export default function AttendanceChart({ records }) {
  if (!records || records.length === 0) return null;

  // Show last 30 records max
  const chartData = [...records]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map((r) => ({
      date: r.date.slice(5), // "MM-DD"
      value: 1,
      status: r.status,
    }));

  return (
    <div className="card-body" style={{ paddingTop: "0.75rem" }}>
      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.5rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        Attendance History
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={chartData} barCategoryGap="20%">
          <XAxis
            dataKey="date"
            stroke="transparent"
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={[0, 1]} allowDecimals={false} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            formatter={(_, __, props) => [props.payload.status, "Status"]}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={STATUS_COLOR[entry.status] || "var(--color-border)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
