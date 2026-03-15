// 运行: node scripts/gen-geodata.js
import { writeFileSync } from "fs";
import { mkdirSync } from "fs";

const GEO_URL = "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json";

const res = await fetch(GEO_URL);
const geo = await res.json();

// 墨卡托投影，输出到 800x600 的 viewBox
const WIDTH = 800, HEIGHT = 600;
const MIN_LON = 73, MAX_LON = 136;
const MIN_LAT = 17, MAX_LAT = 54;

function projectX(lon) {
  return ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * WIDTH;
}
function projectY(lat) {
  const toRad = (d) => d * Math.PI / 180;
  const y  = Math.log(Math.tan(Math.PI/4 + toRad(lat)/2));
  const y0 = Math.log(Math.tan(Math.PI/4 + toRad(MIN_LAT)/2));
  const y1 = Math.log(Math.tan(Math.PI/4 + toRad(MAX_LAT)/2));
  return (1 - (y - y0) / (y1 - y0)) * HEIGHT;
}

function ringToPath(ring) {
  return ring.map((pt, i) =>
    `${i === 0 ? "M" : "L"}${projectX(pt[0]).toFixed(1)},${projectY(pt[1]).toFixed(1)}`
  ).join(" ") + " Z";
}

function featureToPath(feature) {
  const { type, coordinates } = feature.geometry;
  const rings = type === "Polygon" ? coordinates : coordinates.flat();
  return rings.map(ringToPath).join(" ");
}

const provinces = geo.features
  .filter(f => f.properties.level === "province")
  .map(f => ({
    code: String(f.properties.adcode),
    name: f.properties.name,
    d: featureToPath(f),
  }));

mkdirSync("src/data", { recursive: true });
writeFileSync(
  "src/data/geoData.js",
  `// 自动生成，勿手动编辑\nexport const PROVINCES_GEO = ${JSON.stringify(provinces, null, 2)};\n`
);
console.log(`生成完成，共 ${provinces.length} 个省级区域`);