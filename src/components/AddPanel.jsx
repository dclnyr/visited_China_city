import { useState, useEffect } from "react";
import { PROVINCES, GEO_BASE } from "../data/provinces.js";

const LEVELS = [
  { key: "province", label: "省级" },
  { key: "city",     label: "市级" },
  { key: "county",   label: "县级" },
];

/**
 * 添加足迹面板。
 * Props:
 *  - data       当前足迹数据
 *  - onAdd      ({ type, prov, city, county }) => void
 */
export default function AddPanel({ data, onAdd }) {
  const [level,    setLevel]    = useState("province");
  const [selProv,  setSelProv]  = useState("");
  const [selCity,  setSelCity]  = useState("");
  const [selCounty,setSelCounty]= useState("");

  const [cityOpts,   setCityOpts]   = useState([]);
  const [countyOpts, setCountyOpts] = useState([]);
  const [loadCity,   setLoadCity]   = useState(false);
  const [loadCounty, setLoadCounty] = useState(false);

  // 省份变化 → 拉取城市
  useEffect(() => {
    if (!selProv) { setCityOpts([]); return; }
    setLoadCity(true);
    fetch(`${GEO_BASE}/${selProv}_full.json`)
      .then(r => r.json())
      .then(d => setCityOpts(d.features.map(f => ({
        code: String(f.properties.adcode),
        name: f.properties.name,
      }))))
      .catch(() => setCityOpts([]))
      .finally(() => setLoadCity(false));
    setSelCity("");
    setSelCounty("");
    setCountyOpts([]);
  }, [selProv]);

  // 城市变化 → 拉取区县
  useEffect(() => {
    if (!selCity) { setCountyOpts([]); return; }
    setLoadCounty(true);
    fetch(`${GEO_BASE}/${selCity}_full.json`)
      .then(r => r.json())
      .then(d => setCountyOpts(d.features.map(f => ({
        code: String(f.properties.adcode),
        name: f.properties.name,
      }))))
      .catch(() => setCountyOpts([]))
      .finally(() => setLoadCounty(false));
    setSelCounty("");
  }, [selCity]);

  const handleLevelChange = (l) => {
    setLevel(l);
    setSelCity("");
    setSelCounty("");
  };

  const canAdd = (() => {
    if (level === "province") return !!selProv;
    if (level === "city")     return !!selCity;
    return !!selCounty;
  })();

  const handleAdd = () => {
    const prov   = PROVINCES.find(p => p.code === selProv);
    const city   = cityOpts.find(c => c.code === selCity);
    const county = countyOpts.find(c => c.code === selCounty);

    if (level === "province" && prov) {
      if (data.provs.find(p => p.code === prov.code)) return;
      onAdd({ type: "province", prov });
    } else if (level === "city" && city) {
      if (data.cities.find(c => c.code === city.code)) return;
      onAdd({ type: "city", prov, city });
    } else if (level === "county" && county) {
      if (data.counties.find(c => c.code === county.code)) return;
      onAdd({ type: "county", prov, city, county });
    }
  };

  return (
    <div className="add-panel fade-in">
      {/* Level Selector */}
      <div className="level-tabs">
        {LEVELS.map(({ key, label }) => (
          <button
            key={key}
            className={`level-btn ${level === key ? "active" : ""}`}
            onClick={() => handleLevelChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Province */}
      <div className="field-group">
        <label className="field-label">省 / 直辖市 / 自治区</label>
        <select value={selProv} onChange={e => setSelProv(e.target.value)}>
          <option value="">— 请选择 —</option>
          {PROVINCES.map(p => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* City */}
      {(level === "city" || level === "county") && (
        <div className="field-group">
          <label className="field-label">城市</label>
          <select value={selCity} onChange={e => setSelCity(e.target.value)} disabled={!selProv}>
            <option value="">
              {!selProv ? "请先选择省份" : loadCity ? "加载中…" : cityOpts.length ? "— 请选择 —" : "暂无数据"}
            </option>
            {cityOpts.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* County */}
      {level === "county" && (
        <div className="field-group">
          <label className="field-label">区 / 县</label>
          <select value={selCounty} onChange={e => setSelCounty(e.target.value)} disabled={!selCity}>
            <option value="">
              {!selCity ? "请先选择城市" : loadCounty ? "加载中…" : countyOpts.length ? "— 请选择 —" : "暂无数据"}
            </option>
            {countyOpts.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
      )}

      <button
        className={`add-btn ${canAdd ? "active" : ""}`}
        onClick={handleAdd}
        disabled={!canAdd}
      >
        ＋ 添加到足迹
      </button>

      {/* Tips */}
      <div className="tips-box">
        <p className="tips-title">💡 使用提示</p>
        <ul>
          <li>直接点击地图省份可快速标记 / 取消</li>
          <li>省级：选省份后点「添加」即可</li>
          <li>市 / 县级：逐级选择后点「添加」</li>
          <li>数据自动保存在本地浏览器中</li>
        </ul>
      </div>

      <style>{`
        .add-panel { padding: 14px 16px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex: 1; }
        .level-tabs { display: flex; background: var(--bg-deep); border-radius: 7px; padding: 3px; }
        .level-btn  {
          flex: 1; padding: 7px 0; border: none; background: transparent; border-radius: 5px;
          color: var(--text-dim); font-weight: 600; font-size: 12px; cursor: pointer;
          font-family: inherit; transition: all 0.15s;
        }
        .level-btn.active {
          background: #163a58; color: var(--text-main); font-weight: 800;
          box-shadow: 0 1px 6px rgba(0,0,0,0.4);
        }
        .field-group { display: flex; flex-direction: column; gap: 5px; }
        .field-label { font-size: 11px; color: var(--text-dim); letter-spacing: 0.5px; }
        .add-btn {
          width: 100%; padding: 11px 0; border: none; border-radius: 7px;
          background: var(--border); color: var(--text-dim);
          font-weight: 900; font-size: 13px; cursor: not-allowed;
          font-family: inherit; letter-spacing: 0.5px; transition: all 0.2s;
        }
        .add-btn.active {
          background: linear-gradient(135deg, var(--accent), var(--accent-h));
          color: var(--bg-deep); cursor: pointer;
          box-shadow: 0 2px 16px rgba(200,146,26,0.35);
        }
        .add-btn.active:hover { filter: brightness(1.1); }
        .tips-box {
          background: var(--bg-deep); border: 1px solid var(--border);
          border-radius: 8px; padding: 11px 14px;
          font-size: 11px; color: var(--text-dim); line-height: 1.9;
        }
        .tips-title { color: var(--text-mid); font-weight: 700; margin-bottom: 5px; }
        .tips-box ul { padding-left: 14px; }
        .tips-box li { margin-bottom: 2px; }
      `}</style>
    </div>
  );
}
