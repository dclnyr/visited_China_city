import { useState } from "react";
import StatsPanel from "./StatsPanel.jsx";
import AddPanel   from "./AddPanel.jsx";
import ListPanel  from "./ListPanel.jsx";

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Sidebar({ data, onAdd, onRemove, onUpdateNote }) {
  const [activeTab, setActiveTab] = useState("add");

  const totalItems = data.provs.length + data.cities.length + data.counties.length;

  const handleExportJSON = () => {
    download("travel-records.json", JSON.stringify(data, null, 2), "application/json");
  };

  const handleExportMD = () => {
    const lines = ["# 我的中国足迹\n"];
    const fmt = (label, arr, getTitle) => {
      if (!arr.length) return;
      lines.push(`## ${label}（${arr.length} 个）\n`);
      arr.forEach(x => {
        lines.push(`### ${getTitle(x)}`);
        if (x.note) lines.push(`\n> ${x.note.replace(/\n/g, "\n> ")}\n`);
        else lines.push("");
      });
    };
    fmt("省级", data.provs, x => x.name);
    fmt("市级", data.cities, x => `${x.provName} · ${x.name}`);
    fmt("县级", data.counties, x => `${x.provName} · ${x.cityName} · ${x.name}`);
    download("travel-records.md", lines.join("\n"), "text/markdown");
  };

  const tabs = [
    { key: "add",  label: "添加足迹" },
    { key: "list", label: `足迹列表${totalItems ? ` (${totalItems})` : ""}` },
  ];

  return (
    <aside style={{
      width: 272,
      minWidth: 272,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #122030",
      background: "#0a1a28",
    }}>

      {/* ── Header（固定高度）── */}
      <header style={{
        flexShrink: 0,
        padding: "18px 18px 14px",
        borderBottom: "1px solid #122030",
      }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: "#304f68", textTransform: "uppercase", marginBottom: 4 }}>
          CHINA TRAVEL MAP
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: "#e0d090", letterSpacing: "0.5px", margin: 0 }}>
          我的中国足迹
        </h1>
      </header>

      {/* ── Stats（固定高度）── */}
      <div style={{ flexShrink: 0 }}>
        <StatsPanel data={data} />
      </div>

      {/* ── Tab Bar（固定高度）── */}
      <div style={{ flexShrink: 0, display: "flex", borderBottom: "1px solid #122030" }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: "10px 0", border: "none",
              background: "transparent", cursor: "pointer",
              fontFamily: "inherit", fontSize: 12, fontWeight: 700,
              color: activeTab === tab.key ? "#7ab8d8" : "#304f68",
              borderBottom: activeTab === tab.key ? "2px solid #c8921a" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content（flex:1 撑满剩余空间，内部自己滚动）── */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {activeTab === "add"
          ? <AddPanel data={data} onAdd={onAdd} />
          : <ListPanel data={data} onRemove={onRemove} onUpdateNote={onUpdateNote} />
        }
      </div>

      {/* ── 导出区（固定高度，有数据时显示）── */}
      {totalItems > 0 && (
        <div style={{
          flexShrink: 0,
          padding: "10px 16px",
          borderTop: "1px solid #122030",
          display: "flex",
          gap: 8,
        }}>
          <button onClick={handleExportJSON} style={exportBtn("#1a3e58", "#4a98c8")}>⬇ JSON</button>
          <button onClick={handleExportMD}   style={exportBtn("#1a3a28", "#6ab87a")}>⬇ Markdown</button>
        </div>
      )}
    </aside>
  );
}

function exportBtn(bg, color) {
  return {
    flex: 1, padding: "7px 0",
    border: `1px solid ${color}44`,
    borderRadius: 6, background: bg, color,
    fontSize: 11, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit",
  };
}
