/**
 * 足迹列表面板。
 * Props:
 *  - data     当前足迹数据
 *  - onRemove ({ type, code }) => void
 */
export default function ListPanel({ data, onRemove }) {
  const items = [
    ...data.provs.map(p => ({
      id:    `prov-${p.code}`,
      type:  "省",
      label: p.name,
      sub:   null,
      onRm:  () => onRemove({ type: "province", code: p.code }),
    })),
    ...data.cities.map(c => ({
      id:    `city-${c.code}`,
      type:  "市",
      label: c.name,
      sub:   c.provName,
      onRm:  () => onRemove({ type: "city", code: c.code }),
    })),
    ...data.counties.map(c => ({
      id:    `county-${c.code}`,
      type:  "县",
      label: c.name,
      sub:   `${c.provName} · ${c.cityName}`,
      onRm:  () => onRemove({ type: "county", code: c.code }),
    })),
  ];

  const TYPE_COLORS = {
    "省": "var(--accent)",
    "市": "var(--city-color)",
    "县": "var(--county-color)",
  };

  if (items.length === 0) {
    return (
      <div className="list-empty fade-in">
        <span className="list-empty__icon">📍</span>
        <p>暂无足迹记录</p>
        <p className="list-empty__hint">
          点击地图省份，或切换到<br />「添加足迹」标签页开始记录
        </p>
      </div>
    );
  }

  return (
    <div className="list-panel fade-in">
      <div className="list-count">共 {items.length} 条记录</div>

      {items.map(item => (
        <div key={item.id} className="list-item">
          <span
            className="list-item__badge"
            style={{ background: TYPE_COLORS[item.type] }}
          >
            {item.type}
          </span>
          <div className="list-item__text">
            <span className="list-item__name">{item.label}</span>
            {item.sub && <span className="list-item__sub">{item.sub}</span>}
          </div>
          <button className="list-item__rm" onClick={item.onRm} title="删除">×</button>
        </div>
      ))}

      <style>{`
        .list-panel {
          flex: 1; overflow-y: auto; padding: 10px 16px;
          display: flex; flex-direction: column; gap: 5px;
        }
        .list-count {
          font-size: 10px; color: var(--text-dim);
          padding: 2px 0 6px; letter-spacing: 0.5px;
        }
        .list-item {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 9px; background: var(--bg-deep);
          border: 1px solid var(--border); border-radius: 6px;
          transition: border-color 0.15s;
        }
        .list-item:hover { border-color: var(--border-mid); }
        .list-item__badge {
          flex-shrink: 0; font-size: 9px; font-weight: 900;
          padding: 2px 6px; border-radius: 3px;
          color: var(--bg-deep);
        }
        .list-item__text {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column; gap: 1px;
        }
        .list-item__name {
          font-size: 12px; color: var(--text-light);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .list-item__sub {
          font-size: 10px; color: var(--text-dim);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .list-item__rm {
          flex-shrink: 0; background: none; border: none;
          color: var(--text-dim); cursor: pointer; font-size: 18px;
          line-height: 1; padding: 0 2px; transition: color 0.15s;
        }
        .list-item__rm:hover { color: #b05050; }
        .list-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px; text-align: center; padding: 32px 16px;
        }
        .list-empty__icon { font-size: 36px; }
        .list-empty p     { font-size: 13px; color: var(--text-dim); }
        .list-empty__hint { font-size: 11px; color: var(--border-mid); line-height: 1.7; }
      `}</style>
    </div>
  );
}
