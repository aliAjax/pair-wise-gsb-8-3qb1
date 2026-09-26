// 本地留档：战役数据存 localStorage，页面再次打开时原样恢复。
import { seed } from './data/seed';

const KEY = 'campaign-ledger-v1';

export function loadCampaign() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (data && Array.isArray(data.sessions) && Array.isArray(data.characters)) return data;
  } catch { /* 数据损坏时回退种子 */ }
  return seed;
}

export function saveCampaign(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch { /* 存储不可用时静默跳过 */ }
}
