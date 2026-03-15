import { useMemo } from "react";
import { useStorage } from "./hooks/useStorage.js";
import Sidebar from "./components/Sidebar.jsx";
import MapView from "./components/MapView.jsx";

export default function App() {
  const [data, setData] = useStorage();

  const visitedCodes = useMemo(
    () => new Set(data.provs.map(p => p.code)),
    [data.provs]
  );

  const handleToggleProv = (code, name) => {
    setData(prev => ({
      ...prev,
      provs: prev.provs.find(p => p.code === code)
        ? prev.provs.filter(p => p.code !== code)
        : [...prev.provs, { code, name }],
    }));
  };

  const handleAdd = ({ type, prov, city, county }) => {
    setData(prev => {
      if (type === "province")
        return { ...prev, provs: [...prev.provs, { code: prov.code, name: prov.name }] };
      if (type === "city")
        return { ...prev, cities: [...prev.cities, { code: city.code, name: city.name, provCode: prov?.code, provName: prov?.name }] };
      return { ...prev, counties: [...prev.counties, { code: county.code, name: county.name, cityCode: city?.code, cityName: city?.name, provCode: prov?.code, provName: prov?.name }] };
    });
  };

  const handleRemove = ({ type, code }) => {
    setData(prev => {
      if (type === "province") return { ...prev, provs: prev.provs.filter(x => x.code !== code) };
      if (type === "city")     return { ...prev, cities: prev.cities.filter(x => x.code !== code) };
      return { ...prev, counties: prev.counties.filter(x => x.code !== code) };
    });
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Sidebar data={data} onAdd={handleAdd} onRemove={handleRemove} />
      <MapView visitedCodes={visitedCodes} onToggleProv={handleToggleProv} />
    </div>
  );
}