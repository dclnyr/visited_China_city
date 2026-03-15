import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "china-travel-map-v1";

const defaultData = {
  provs:    [], // [{ code, name }]
  cities:   [], // [{ code, name, provCode, provName }]
  counties: [], // [{ code, name, cityCode, cityName, provCode, provName }]
};

/**
 * 持久化足迹数据到 localStorage。
 * 返回 [data, setData, ready]
 */
export function useStorage() {
  const [data, setData] = useState(defaultData);
  const [ready, setReady] = useState(false);
  const isFirst = useRef(true);

  // 初始化：从 localStorage 读取
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData({ ...defaultData, ...parsed });
      }
    } catch {
      // 读取失败时使用默认值
    } finally {
      setReady(true);
    }
  }, []);

  // 数据变更时写入 localStorage（跳过首次挂载）
  useEffect(() => {
    if (!ready) return;
    if (isFirst.current) { isFirst.current = false; return; }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // 写入失败时静默忽略（如无痕模式）
    }
  }, [data, ready]);

  return [data, setData, ready];
}
