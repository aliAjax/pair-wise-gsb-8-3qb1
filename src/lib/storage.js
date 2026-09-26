// 本地留档：读写 localStorage，并对旧数据做兜底补全。
import { seed } from '../data/seed.js';

const KEY = 'campaign-log-v2';

const normalize = (data) => ({
  ...seed,
  ...data,
  characters: data.characters || seed.characters,
  sessions: (data.sessions || []).map((s) => ({ places: [], loot: [], ...s })),
});

export function loadCampaign() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : seed;
  } catch {
    return seed;
  }
}

export function saveCampaign(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* 存储不可用时静默失败，页面内数据仍可用 */
  }
}
