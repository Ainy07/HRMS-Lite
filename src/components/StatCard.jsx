export default function StatCard({ label, value, icon, accentColor = "var(--color-accent)", accentGlow }) {
  const glow = accentGlow || `${accentColor}1F`; // 12% opacity fallback

  return (
    <div
      className="stat-card"
      style={{ "--card-accent": accentColor, "--card-accent-glow": glow }}
    >
      <div className="stat-card-top">
        <div style={{ flex: 1 }} />
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
