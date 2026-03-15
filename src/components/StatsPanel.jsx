/**
 * 统计面板：显示省市县到访数量及覆盖率。
 */
export default function StatsPanel({ data }) {
  const total = 34; // 含港澳台
  const pct   = Math.round((data.provs.length / total) * 100);

  const stats = [
    { value: data.provs.length, sub: `/${total}`, label: "已到访省份",  color: "var(--accent)" },
    { value: `${pct}%`,         sub: "",          label: "省级覆盖率",  color: "var(--text-main)" },
    { value: data.cities.length,  sub: "", label: "已记录城市", color: "var(--city-color)" },
    { value: data.counties.length, sub: "", label: "已记录区县", color: "var(--county-color)" },
  ];

  return (
    <div className="stats-panel">
      {stats.map(s => (
        <div key={s.label} className="stat-card">
          <div className="stat-value" style={{ color: s.color }}>
            {s.value}
            {s.sub && <span className="stat-sub">{s.sub}</span>}
          </div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}

      <style>{`
        .stats-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
        }
        .stat-card {
          background: var(--bg-deep);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 11px;
        }
        .stat-value {
          font-size: 19px;
          font-weight: 900;
          line-height: 1;
        }
        .stat-sub {
          font-size: 10px;
          color: var(--text-dim);
        }
        .stat-label {
          font-size: 10px;
          color: var(--text-dim);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
