import { useMemo } from "react";
import { useStorage } from "./hooks/useStorage.js";
import Sidebar from "./components/Sidebar.jsx";
import MapView from "./components/MapView.jsx";

export default function App() {
  const [data, setData] = useStorage();

  const visitedCodes = useMemo(() => {
    const codes = new Set();
    data.provs.forEach(p => codes.add(p.code));
    data.cities.forEach(c => { if (c.provCode) codes.add(c.provCode); });
    data.counties.forEach(c => { if (c.provCode) codes.add(c.provCode); });
    return codes;
  }, [data]);

  const handleToggleProv = (code, name) => {
    setData(prev => ({
      ...prev,
      provs: prev.provs.find(p => p.code === code)
        ? prev.provs.filter(p => p.code !== code)
        : [...prev.provs, { code, name, note: "" }],
    }));
  };

  const handleAdd = ({ type, prov, city, county }) => {
    setData(prev => {
      if (type === "province")
        return { ...prev, provs: [...prev.provs, { code: prov.code, name: prov.name, note: "" }] };
      if (type === "city")
        return { ...prev, cities: [...prev.cities, { code: city.code, name: city.name, provCode: prov?.code, provName: prov?.name, note: "" }] };
      return { ...prev, counties: [...prev.counties, { code: county.code, name: county.name, cityCode: city?.code, cityName: city?.name, provCode: prov?.code, provName: prov?.name, note: "" }] };
    });
  };

  const handleRemove = ({ type, code }) => {
    setData(prev => {
      if (type === "province") return { ...prev, provs:    prev.provs.filter(x => x.code !== code) };
      if (type === "city")     return { ...prev, cities:   prev.cities.filter(x => x.code !== code) };
      return                         { ...prev, counties: prev.counties.filter(x => x.code !== code) };
    });
  };

  // ── 更新备注 ──────────────────────────────────────────
  const handleUpdateNote = ({ type, code, note }) => {
    setData(prev => {
      const update = arr => arr.map(x => x.code === code ? { ...x, note } : x);
      if (type === "province") return { ...prev, provs:    update(prev.provs) };
      if (type === "city")     return { ...prev, cities:   update(prev.cities) };
      return                         { ...prev, counties: update(prev.counties) };
    });
  };

  return (
    <div style={{ display:"flex", width:"100vw", height:"100vh", overflow:"hidden" }}>
      <Sidebar
        data={data}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onUpdateNote={handleUpdateNote}
      />
      <MapView visitedCodes={visitedCodes} onToggleProv={handleToggleProv} />
    </div>
  );
}