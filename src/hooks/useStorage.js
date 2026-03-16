import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "china-travel-map-v1";

const defaultData = {
  provs:    [],
  cities:   [],
  counties: [],
};

export function useStorage() {
  const [data, setData] = useState(defaultData);
  const [ready, setReady] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // 兼容旧数据：确保每条记录都有 note 字段
        const ensureNote = arr => (arr || []).map(x => ({ note: "", ...x }));
        setData({
          provs:    ensureNote(parsed.provs),
          cities:   ensureNote(parsed.cities),
          counties: ensureNote(parsed.counties),
        });
      }
    } catch {}
    finally { setReady(true); }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (isFirst.current) { isFirst.current = false; return; }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, [data, ready]);

  return [data, setData, ready];
}