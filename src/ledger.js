// 结算规则：按章节日期先后推进，逐条结算战利品登记。
// 旧章节的登记保留当时的持有人不变；物品转手时由新章节的登记
// 从现有持有人的余量中划转，数量不足的部分留在当前章节并记缺。

export const orderSessions = (sessions) =>
  sessions
    .map((s, i) => ({ s, i }))
    .sort((a, b) => String(a.s.date).localeCompare(String(b.s.date)) || a.i - b.i)
    .map((x) => x.s);

const ensure = (map, key, make) => {
  if (!map.has(key)) map.set(key, make());
  return map.get(key);
};

// 返回 { ordered, items, bySession }
// - items: 每种物品的当前持有人（同名物品不同持有人分开统计）与换手历史
// - bySession: 每章登记条目结算后的结果（含 settled / short / from）
export function settleLoot(sessions) {
  const ordered = orderSessions(sessions);
  const balances = new Map(); // item -> Map(holder -> qty)
  const items = new Map(); // item -> { name, history: [] }
  const bySession = new Map();

  for (const s of ordered) {
    const settled = [];
    for (const raw of s.loot || []) {
      const name = (raw.item || '').trim();
      const holder = (raw.holder || '').trim();
      const qty = Math.max(0, Number(raw.qty) || 0);
      if (!name || !holder || qty === 0) continue;

      const bal = ensure(balances, name, () => new Map());
      const item = ensure(items, name, () => ({ name, history: [] }));
      const self = bal.get(holder) || 0;
      const sources = [...bal.entries()].filter(([h, q]) => h !== holder && q > 0).map(([h]) => h);

      let entry;
      if (self > 0 || sources.length === 0) {
        // 本人已有存货（增补）或首次出现（获得）：直接入账，不从他人划转
        bal.set(holder, self + qty);
        entry = { item: name, holder, qty, kind: self > 0 ? '增补' : '获得', settled: qty, short: 0, from: [] };
      } else {
        // 转手：按登记先后从其他持有人余量中划转，不足部分记缺
        let need = qty;
        const from = [];
        for (const h of sources) {
          if (need === 0) break;
          const take = Math.min(need, bal.get(h));
          bal.set(h, bal.get(h) - take);
          from.push({ holder: h, qty: take });
          need -= take;
        }
        const moved = qty - need;
        bal.set(holder, moved);
        entry = { item: name, holder, qty, kind: '转手', settled: moved, short: need, from };
      }
      settled.push(entry);
      item.history.push({ sessionId: s.id, title: s.title, date: s.date, ...entry });
    }
    bySession.set(s.id, settled);
  }

  const list = [...items.values()].map((it) => ({
    ...it,
    holders: [...balances.get(it.name).entries()]
      .filter(([, q]) => q > 0)
      .map(([holder, qty]) => ({ holder, qty })),
    total: [...balances.get(it.name).values()].reduce((a, b) => a + b, 0),
  }));

  return { ordered, items: list, bySession };
}

// 同名地点合并，统计出现次数与到访章节
export function collectPlaces(sessions) {
  const map = new Map();
  for (const s of orderSessions(sessions)) {
    const names = [...new Set((s.places || []).map((p) => (p || '').trim()).filter(Boolean))];
    for (const name of names) {
      const p = ensure(map, name, () => ({ name, count: 0, visits: [] }));
      p.count += 1;
      p.visits.push({ sessionId: s.id, title: s.title, date: s.date });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'));
}

// 每个角色当前持有的物品
export function holdingsByCharacter(ledger) {
  const map = new Map();
  for (const it of ledger.items) {
    for (const { holder, qty } of it.holders) {
      ensure(map, holder, () => []).push({ item: it.name, qty });
    }
  }
  return map;
}
