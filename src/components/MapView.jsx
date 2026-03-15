import { useState, useRef } from "react";
import { PROVINCES_GEO } from "../data/geoData.js";

const C_VISITED = "#c8921a";
const C_DEFAULT = "#0f2236";
const C_HOVER_V = "#e0a820";
const C_HOVER_D = "#1a3e60";
const C_STROKE  = "#1a3e5c";

export default function MapView({ visitedCodes, onToggleProv }) {
  const [tooltip,    setTooltip]    = useState(null);
  const [hoveredCode, setHoveredCode] = useState(null);
  const [viewBox,    setViewBox]    = useState("0 0 800 600");
  const svgRef  = useRef(null);
  const wrapRef = useRef(null);

  // 缩放状态
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const dragging = useRef(false);
  const lastPos  = useRef({ x: 0, y: 0 });

  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setTransform(prev => {
      const k = Math.min(Math.max(prev.k * factor, 1), 16);
      const x = mx - (mx - prev.x) * (k / prev.k);
      const y = my - (my - prev.y) * (k / prev.k);
      return { x, y, k };
    });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  };
  const handleMouseUp = () => { dragging.current = false; };

  return (
    <div
      ref={wrapRef}
      style={{ flex:1, minWidth:0, height:"100vh", position:"relative", background:"#071018", overflow:"hidden" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        style={{ width:"100%", height:"100%", display:"block" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          {PROVINCES_GEO.map(({ code, name, d }) => {
            const visited = visitedCodes.has(code);
            const hovered = hoveredCode === code;
            let fill = visited ? C_VISITED : C_DEFAULT;
            if (hovered) fill = visited ? C_HOVER_V : C_HOVER_D;

            return (
              <path
                key={code}
                d={d}
                fill={fill}
                stroke={hovered ? "#5ab8e0" : C_STROKE}
                strokeWidth={hovered ? 1.5 / transform.k : 0.7 / transform.k}
                style={{ cursor:"pointer", transition:"fill 0.25s" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleProv(code, name);
                }}
                onMouseEnter={(e) => {
                  setHoveredCode(code);
                  const rect = wrapRef.current.getBoundingClientRect();
                  setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, name, visited });
                }}
                onMouseMove={(e) => {
                  const rect = wrapRef.current.getBoundingClientRect();
                  setTooltip(t => t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : t);
                }}
                onMouseLeave={() => { setHoveredCode(null); setTooltip(null); }}
              />
            );
          })}
        </g>
      </svg>

      {tooltip && (
        <div style={{
          position:"absolute", left:tooltip.x+14, top:tooltip.y-14,
          pointerEvents:"none", zIndex:100,
          background:"#0a1a28", border:`1px solid ${visitedCodes.has(hoveredCode) ? "#c8921a88":"#1e4060"}`,
          borderRadius:8, padding:"9px 13px", boxShadow:"0 6px 24px rgba(0,0,0,.8)",
        }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#e0d090" }}>{tooltip.name}</div>
          <div style={{ fontSize:11, marginTop:4, color: visitedCodes.has(hoveredCode) ? "#c8921a":"#405870" }}>
            {visitedCodes.has(hoveredCode) ? "✓ 已到访 · 点击取消标记" : "点击标记为已到访"}
          </div>
        </div>
      )}

      <div style={{ position:"absolute", bottom:14, right:14, background:"rgba(10,26,40,.92)", border:"1px solid #122030", borderRadius:8, padding:"10px 14px" }}>
        <div style={{ fontSize:9, letterSpacing:2, color:"#304f68", marginBottom:8 }}>图 例</div>
        {[[C_VISITED,"省级已到访"],[C_DEFAULT,"未到访省份"]].map(([c,l]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
            <div style={{ width:14, height:12, borderRadius:2, background:c, border:"1px solid #1e3d5a" }} />
            <span style={{ fontSize:11, color:"#507088" }}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{ position:"absolute", bottom:14, left:14, fontSize:11, color:"#304f68", userSelect:"none" }}>
        滚轮缩放 · 拖拽平移 · 点击省份快速标记
      </div>
    </div>
  );
}