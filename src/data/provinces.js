/**
 * 中国所有省级行政区列表（含直辖市、自治区、特别行政区）
 * code: 国家统计局行政区划代码（高德地图 adcode）
 */
export const PROVINCES = [
  { code: "110000", name: "北京市",           short: "京" },
  { code: "120000", name: "天津市",           short: "津" },
  { code: "130000", name: "河北省",           short: "冀" },
  { code: "140000", name: "山西省",           short: "晋" },
  { code: "150000", name: "内蒙古自治区",     short: "蒙" },
  { code: "210000", name: "辽宁省",           short: "辽" },
  { code: "220000", name: "吉林省",           short: "吉" },
  { code: "230000", name: "黑龙江省",         short: "黑" },
  { code: "310000", name: "上海市",           short: "沪" },
  { code: "320000", name: "江苏省",           short: "苏" },
  { code: "330000", name: "浙江省",           short: "浙" },
  { code: "340000", name: "安徽省",           short: "皖" },
  { code: "350000", name: "福建省",           short: "闽" },
  { code: "360000", name: "江西省",           short: "赣" },
  { code: "370000", name: "山东省",           short: "鲁" },
  { code: "410000", name: "河南省",           short: "豫" },
  { code: "420000", name: "湖北省",           short: "鄂" },
  { code: "430000", name: "湖南省",           short: "湘" },
  { code: "440000", name: "广东省",           short: "粤" },
  { code: "450000", name: "广西壮族自治区",   short: "桂" },
  { code: "460000", name: "海南省",           short: "琼" },
  { code: "500000", name: "重庆市",           short: "渝" },
  { code: "510000", name: "四川省",           short: "川" },
  { code: "520000", name: "贵州省",           short: "贵" },
  { code: "530000", name: "云南省",           short: "云" },
  { code: "540000", name: "西藏自治区",       short: "藏" },
  { code: "610000", name: "陕西省",           short: "陕" },
  { code: "620000", name: "甘肃省",           short: "甘" },
  { code: "630000", name: "青海省",           short: "青" },
  { code: "640000", name: "宁夏回族自治区",   short: "宁" },
  { code: "650000", name: "新疆维吾尔自治区", short: "新" },
  { code: "710000", name: "台湾省",           short: "台" },
  { code: "810000", name: "香港特别行政区",   short: "港" },
  { code: "820000", name: "澳门特别行政区",   short: "澳" },
];

/** 高德地图 GeoJSON 数据源 */
export const GEO_BASE = "/areas_v3/bound";