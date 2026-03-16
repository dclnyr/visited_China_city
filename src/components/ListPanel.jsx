import { useState } from "react";

const TYPE_COLOR = { "省": "#c8921a", "市": "#6ab87a", "县": "#b87898" };

export default function ListPanel({ data, onRemove, onUpdateNote }) {
  const [editingId, setEditingId] = useState(null);
  const [draftNote, setDraftNote] = useState("");

  const items = [
    ...data.provs.map(p => ({
      id: `prov-${p.code}`, type: "省",
      name: p.name, sub: null, note: p.note || "",
      onRm:       () => onRemove({ type: "province", code: p.code }),
      onSaveNote: (n) => onUpdateNote({ type: "province", code: p.code, note: n }),
    })),
    ...data.cities.map(c => ({
      id: `city-${c.code}`, type: "市",
      name: c.name, sub: c.provName || "", note: c.note || "",
      onRm:       () => onRemove({ type: "city", code: c.code }),
      onSaveNote: (n) => onUpdateNote({ type: "city", code: c.code, note: n }),
    })),
    ...data.counties.map(c => ({
      id: `county-${c.code}`, type: "县",
      name: c.name,
      sub: [c.provName, c.cityName].filter(Boolean).join(" · "),
      note: c.note || "",
      onRm:       () => onRemove({ type: "county", code: c.code }),
      onSaveNote: (n) => onUpdateNote({ type: "county", code: c.code, note: n }),
    })),
  ];

  if (items.length === 0) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 24, textAlign: "center", gap: 8,
      }}>
        <div style={{ fontSize: 32 }}>📍</div>
        <div style={{ fontSize: 12, color: "#304f68" }}>暂无足迹记录</div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      overflowX: "hidden",
      padding: "8px 12px",
    }}>
      <style>{`
        .lp-card { background:#071018; border:1px solid #1a3050; border-radius:6px; margin-bottom:6px; }
        .lp-row  { display:flex; align-items:center; gap:6px; padding:8px; min-height:38px; box-sizing:border-box; }
        .lp-badge { flex-shrink:0; font-size:9px; font-weight:900; padding:2px 5px; border-radius:3px; color:#071018; }
        .lp-texts { flex:1; min-width:0; overflow:hidden; }
        .lp-name  { font-size:12px; color:#a8c8e0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .lp-sub   { font-size:10px; color:#304f68; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .lp-btn   { flex-shrink:0; background:none; border:none; cursor:pointer; font-family:inherit; padding:3px 5px; border-radius:3px; line-height:1; }
        .lp-btn:hover { background:#122030; }
        .lp-note-preview { margin:0 8px 8px; padding:6px 8px; background:#0a1a28; border:1px solid #1a3050; border-radius:4px; font-size:11px; color:#7898b0; line-height:1.5; white-space:pre-wrap; word-break:break-all; cursor:pointer; }
        .lp-note-preview:hover { border-color:#2a5080; }
        .lp-textarea { width:100%; box-sizing:border-box; background:#0a1a28; border:1px solid #1c3a52; border-radius:4px; padding:6px 8px; color:#a8c8e0; font-size:11px; font-family:inherit; line-height:1.5; resize:vertical; outline:none; display:block; }
        .lp-textarea:focus { border-color:#4a7898; }
        .lp-save { flex:1; padding:5px 0; border:none; border-radius:4px; background:#c8921a; color:#071018; font-weight:900; font-size:11px; cursor:pointer; font-family:inherit; }
        .lp-save:hover { background:#e0a820; }
        .lp-cancel { padding:5px 10px; border:1px solid #1c3a52; border-radius:4px; background:transparent; color:#4a7898; font-size:11px; cursor:pointer; font-family:inherit; }
        .lp-cancel:hover { border-color:#4a7898; }
      `}</style>

      <div style={{ fontSize: 10, color: "#304f68", marginBottom: 6 }}>
        共 {items.length} 条记录
      </div>

      {items.map(item => {
        const editing = editingId === item.id;
        return (
          <div key={item.id} className="lp-card">
            <div className="lp-row">
              <span className="lp-badge" style={{ background: TYPE_COLOR[item.type] }}>
                {item.type}
              </span>
              <div className="lp-texts">
                <div className="lp-name">{item.name}</div>
                {item.sub && <div className="lp-sub">{item.sub}</div>}
              </div>
              <button
                className="lp-btn"
                title={item.note ? "编辑备注" : "添加备注"}
                style={{ fontSize: 13, color: item.note ? "#6ab87a" : "#304f68" }}
                onClick={() => {
                  if (editing) { setEditingId(null); return; }
                  setEditingId(item.id);
                  setDraftNote(item.note);
                }}
              >
                {item.note ? "📝" : "✏️"}
              </button>
              <button
                className="lp-btn"
                title="删除"
                style={{ fontSize: 16, color: "#304f68" }}
                onClick={item.onRm}
              >
                ×
              </button>
            </div>

            {item.note && !editing && (
              <div
                className="lp-note-preview"
                onClick={() => { setEditingId(item.id); setDraftNote(item.note); }}
              >
                {item.note}
              </div>
            )}

            {editing && (
              <div style={{ padding: "0 8px 8px" }}>
                <textarea
                  className="lp-textarea"
                  autoFocus
                  rows={3}
                  value={draftNote}
                  placeholder="输入备注…"
                  onChange={e => setDraftNote(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Escape") setEditingId(null);
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      item.onSaveNote(draftNote);
                      setEditingId(null);
                    }
                  }}
                />
                <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                  <button
                    className="lp-save"
                    onClick={() => { item.onSaveNote(draftNote); setEditingId(null); }}
                  >
                    保存 (Ctrl+Enter)
                  </button>
                  <button className="lp-cancel" onClick={() => setEditingId(null)}>
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
