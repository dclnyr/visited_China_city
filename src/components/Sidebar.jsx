import { useState } from "react";
import StatsPanel from "./StatsPanel.jsx";
import AddPanel   from "./AddPanel.jsx";
import ListPanel  from "./ListPanel.jsx";

/**
 * 左侧边栏：标题 + 统计 + 标签页(添加/列表)
 */
export default function Sidebar({ data, onAdd, onRemove }) {
  const [activeTab, setActiveTab] = useState("add");

  const totalItems = data.provs.length + data.cities.length + data.counties.length;

  const tabs = [
    { key: "add",  label: "添加足迹" },
    { key: "list", label: `足迹列表${totalItems ? ` (${totalItems})` : ""}` },
  ];

  return (
    <aside className="sidebar">
      {/* ── Header ── */}
      <header className="sidebar__header">
        <div className="sidebar__eyebrow">CHINA TRAVEL MAP</div>
        <h1 className="sidebar__title">我的中国足迹</h1>
      </header>

      {/* ── Stats ── */}
      <StatsPanel data={data} />

      {/* ── Tab Bar ── */}
      <div className="sidebar__tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`sidebar__tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "add" ? (
        <AddPanel data={data} onAdd={onAdd} />
      ) : (
        <ListPanel data={data} onRemove={onRemove} />
      )}

      <style>{`
        .sidebar {
          width: 272px;
          min-width: 272px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border);
          background: var(--bg-panel);
          overflow: hidden;
        }
        .sidebar__header {
          padding: 18px 18px 14px;
          border-bottom: 1px solid var(--border);
        }
        .sidebar__eyebrow {
          font-size: 9px;
          letter-spacing: 3px;
          color: var(--text-dim);
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .sidebar__title {
          font-size: 20px;
          font-weight: 900;
          color: var(--text-white);
          letter-spacing: 0.5px;
        }
        .sidebar__tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
        }
        .sidebar__tab {
          flex: 1;
          padding: 10px 0;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dim);
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
        }
        .sidebar__tab.active {
          color: var(--text-main);
          border-bottom-color: var(--accent);
        }
        .sidebar__tab:hover:not(.active) { color: var(--text-mid); }
      `}</style>
    </aside>
  );
}
